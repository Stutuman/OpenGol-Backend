/* eslint-disable @typescript-eslint/no-unsafe-call */
// uploads.controller.ts
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { R2Service } from './R2Service.service';
import { AttachmentsService } from './attachments.service';
import { ImageProcessingService } from './image-processing.service';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';

type AuthenticatedRequest = Request & {
  user?: { id: string; sub?: string; roles?: string[] };
};

@ApiTags('attachments')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly r2Service: R2Service,
    private readonly attachmentsService: AttachmentsService,
    private readonly imageProcessing: ImageProcessingService,
  ) {}

  // ── Step 1: Presign ────────────────────────────────────────────────
  @ApiOperation({ summary: 'Create pre-signed URL (2 min expiry, tmp/ key)' })
  @ApiBody({
    type: CreateUploadUrlDto,
    examples: {
      userAvatar: {
        value: {
          kind: 'user-avatar',
          entityId: '12345',
          mimeType: 'image/png',
          originalFileName: 'avatar.png',
        },
      },
    },
  })
  @Post('presign')
  async createUploadUrl(
    @Body() dto: CreateUploadUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = this.extractUser(req);
    this.assertCanUpload(user, dto.kind, dto.entityId);

    // Validate declared MIME before generating presign
    this.r2Service.validateMimeType(dto.mimeType);

    const { uploadUrl, tmpKey } = await this.r2Service.createPresignedUploadUrl(
      {
        kind: dto.kind,
        entityId: dto.entityId,
        mimeType: dto.mimeType,
        userId: String(user.id),
      },
    );

    // Track the pending upload in DB
    await this.attachmentsService.createPending({
      tmpKey,
      kind: dto.kind,
      entityId: dto.entityId,
      mimeType: dto.mimeType,
      originalFileName: dto.originalFileName,
      uploadedBy: String(user.id),
    });

    return { uploadUrl, tmpKey };
  }

  // ── Step 2: Confirm ────────────────────────────────────────────────
  @ApiOperation({
    summary:
      'Confirm upload: validates, re-encodes to webp, moves to final key',
  })
  @ApiBody({
    type: ConfirmUploadDto,
    examples: {
      example: {
        value: { tmpKey: 'tmp/550e8400-e29b-41d4-a716-446655440000' },
      },
    },
  })
  @Post('confirm')
  async confirmUpload(
    @Body() dto: ConfirmUploadDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = this.extractUser(req);
    const normalizedTmpKey = this.normalizeTmpKey(dto.tmpKey);

    // 1. Find the pending record
    const pending = await this.attachmentsService.findPendingByTmpKey(
      normalizedTmpKey,
    );
    if (!pending) {
      throw new NotFoundException('No pending upload found for this tmpKey');
    }

    this.assertCanUpload(user, pending.kind, pending.entityId);

    // 2. Verify the tmp object actually exists in R2
    const exists = await this.r2Service.objectExists(normalizedTmpKey);
    if (!exists) {
      throw new NotFoundException('Uploaded object not found in storage');
    }

    // 3. Download the temporary file
    const rawBuffer = await this.r2Service.downloadObject(normalizedTmpKey);

    // 4. Validate real MIME, size, and dimensions
    await this.imageProcessing.validate(rawBuffer, pending.mimeType);

    // 5. Re-encode to webp
    const webpBuffer = await this.imageProcessing.toWebp(rawBuffer);

    // 6. Build final key and upload processed image
    const finalKey = this.r2Service.buildFinalKey(
      pending.kind,
      pending.entityId,
    );
    await this.r2Service.uploadBuffer({
      key: finalKey,
      buffer: webpBuffer,
      contentType: 'image/webp',
    });

    // 7. Delete temporary object
    await this.r2Service.deleteObject(normalizedTmpKey);

    // 8. Save only the final asset in DB, never the tmp
    const publicUrl = this.r2Service.buildPublicUrl(finalKey);
    const saved = await this.attachmentsService.create({
      entityId: pending.entityId,
      kind: pending.kind,
      objectKey: finalKey,
      publicUrl,
      uploadedBy: pending.uploadedBy,
    });
    await this.attachmentsService.linkAttachmentReference(saved);

    // 9. Remove pending record
    await this.attachmentsService.deletePending(pending.id);

    return {
      ok: true,
      id: saved.id,
      objectKey: finalKey,
      publicUrl: saved.publicUrl,
    };
  }

  // ── Delete confirmed asset ─────────────────────────────────────────
  @ApiOperation({ summary: 'Delete a confirmed attachment' })
  @Delete(':assetId')
  async deleteAsset(
    @Param('assetId') assetId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = this.extractUser(req);

    const asset = await this.attachmentsService.findById(assetId);
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    this.assertCanDelete(user, asset.kind, asset.entityId);

    await this.attachmentsService.unlinkAttachmentReference(asset);
    await this.r2Service.deleteObject(asset.objectKey);
    await this.attachmentsService.softDelete(assetId);

    return { ok: true };
  }

  // ── Helpers ────────────────────────────────────────────────────────
  private extractUser(req: AuthenticatedRequest): {
    id: number;
    roles?: string[];
  } {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    return { id: +(user.sub ?? user.id), roles: user.roles };
  }

  private assertCanUpload(
    user: { id: number; roles?: string[] },
    kind: 'club-logo' | 'user-avatar' | 'field-image',
    entityId: string,
  ) {
    if (kind === 'user-avatar' && user.id !== +entityId) {
      throw new ForbiddenException('You cannot upload this avatar');
    }
  }

  private assertCanDelete(
    user: { id: number; roles?: string[] },
    kind: 'club-logo' | 'user-avatar' | 'field-image',
    entityId: string,
  ) {
    if (kind === 'user-avatar' && user.id !== +entityId) {
      throw new ForbiddenException('You cannot delete this avatar');
    }
  }

  private normalizeTmpKey(value: string): string {
    const trimmed = value.trim();

    if (!trimmed) {
      return trimmed;
    }

    try {
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        const parsed = new URL(trimmed);
        return decodeURIComponent(parsed.pathname.replace(/^\//, ''));
      }
    } catch {
      return decodeURIComponent(trimmed);
    }

    return decodeURIComponent(trimmed);
  }
}
