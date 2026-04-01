import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DIMENSION = 4096; // px

// Magic-byte signatures for allowed image types
const SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
];

@Injectable()
export class ImageProcessingService {
  /** Detect actual MIME from magic bytes */
  detectMime(buffer: Buffer): string | null {
    for (const sig of SIGNATURES) {
      if (sig.bytes.every((b, i) => buffer[i] === b)) {
        return sig.mime;
      }
    }
    return null;
  }

  /** Validate size, dimensions, and real MIME type */
  async validate(
    buffer: Buffer,
    declaredMime: string,
  ): Promise<{ width: number; height: number; realMime: string }> {
    // Size check
    if (buffer.length > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large (${(buffer.length / 1024 / 1024).toFixed(1)} MB). Max: 5 MB`,
      );
    }

    // Real MIME check
    const realMime = this.detectMime(buffer);
    if (!realMime) {
      throw new BadRequestException(
        'Could not detect file type. Allowed: jpeg, png, webp',
      );
    }

    if (realMime !== declaredMime) {
      throw new BadRequestException(
        `Declared MIME (${declaredMime}) does not match actual file type (${realMime})`,
      );
    }

    // Dimensions check
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      throw new BadRequestException(
        `Image dimensions ${width}x${height} exceed maximum ${MAX_DIMENSION}x${MAX_DIMENSION}`,
      );
    }

    return { width, height, realMime };
  }

  /** Re-encode to webp with sharp. Returns the webp buffer. */
  async toWebp(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();
  }
}
