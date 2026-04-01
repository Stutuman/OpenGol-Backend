import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

export type UploadKind = 'club-logo' | 'user-avatar' | 'field-image';

export interface EnvConfig {
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_PUBLIC_BASE_URL: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PRESIGN_EXPIRES_SECONDS = 120; // 2 minutes

@Injectable()
export class R2Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly _publicBaseUrl: string;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    const bucket = this.configService.get<string>('R2_BUCKET');
    const publicBaseUrl = this.configService.get<string>('R2_PUBLIC_BASE_URL');

    if (
      !accountId ||
      !accessKeyId ||
      !secretAccessKey ||
      !bucket ||
      !publicBaseUrl
    ) {
      throw new InternalServerErrorException('Missing R2 configuration');
    }

    this.bucket = bucket;
    this._publicBaseUrl = publicBaseUrl.trim().replace(/\/+$/, '');

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  get publicBaseUrl(): string {
    return this._publicBaseUrl;
  }

  buildPublicUrl(objectKey: string): string {
    return `${this._publicBaseUrl}/${objectKey.replace(/^\/+/, '')}`;
  }

  // ── Validate MIME (user-declared) ──────────────────────────────────
  validateMimeType(mimeType: string): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        'Unsupported file type. Allowed: jpeg, png, webp',
      );
    }
  }

  // ── Presign: upload goes to tmp/ with unique UUID key ──────────────
  async createPresignedUploadUrl(params: {
    kind: UploadKind;
    entityId: string;
    mimeType: string;
    userId: string;
  }): Promise<{ uploadUrl: string; tmpKey: string }> {
    const { kind, entityId, mimeType, userId } = params;

    this.validateMimeType(mimeType);

    const tmpKey = `tmp/${randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: tmpKey,
      ContentType: mimeType,
      Metadata: { uploadedBy: userId, entityId, kind },
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: PRESIGN_EXPIRES_SECONDS,
    });

    return { uploadUrl, tmpKey };
  }

  // ── Download an object as Buffer ───────────────────────────────────
  async downloadObject(objectKey: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
    });

    const response = await this.s3.send(command);
    const stream = response.Body;
    if (!stream) {
      throw new InternalServerErrorException('Empty body from R2');
    }
    // Convert readable stream → Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream as AsyncIterable<Buffer>) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  // ── Upload a processed buffer to the final key ─────────────────────
  async uploadBuffer(params: {
    key: string;
    buffer: Buffer;
    contentType: string;
  }): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
    });
    await this.s3.send(command);
  }

  // ── Check existence ────────────────────────────────────────────────
  async objectExists(objectKey: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: objectKey }),
      );
      return true;
    } catch {
      return false;
    }
  }

  // ── Delete single object ───────────────────────────────────────────
  async deleteObject(objectKey: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: objectKey }),
    );
  }

  // ── List objects under a prefix (for cron cleanup) ─────────────────
  async listObjects(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const res = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of res.Contents ?? []) {
        if (obj.Key) keys.push(obj.Key);
      }
      continuationToken = res.IsTruncated
        ? res.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return keys;
  }

  // ── Build the final (permanent) object key ─────────────────────────
  buildFinalKey(kind: UploadKind, entityId: string): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const fileId = randomUUID();

    switch (kind) {
      case 'club-logo':
        return `clubs/${entityId}/logo/${year}/${month}/${fileId}.webp`;
      case 'user-avatar':
        return `users/${entityId}/avatar/${year}/${month}/${fileId}.webp`;
      case 'field-image':
        return `fields/${entityId}/images/${year}/${month}/${fileId}.webp`;
      default:
        throw new BadRequestException('Invalid upload kind');
    }
  }
}
