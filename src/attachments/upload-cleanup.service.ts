import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AttachmentsService } from './attachments.service';
import { R2Service } from './R2Service.service';

@Injectable()
export class UploadCleanupService {
  private readonly logger = new Logger(UploadCleanupService.name);
  private static readonly EXPIRATION_MINUTES = 8;

  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly r2Service: R2Service,
  ) {}

  /** Runs every 1 minute – deletes pending uploads older than 8 min */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCleanup(): Promise<void> {
    const expired = await this.attachmentsService.findExpiredPending(
      UploadCleanupService.EXPIRATION_MINUTES,
    );

    if (expired.length === 0) return;

    this.logger.log(
      `Cleaning up ${expired.length} unconfirmed upload(s) older than ${UploadCleanupService.EXPIRATION_MINUTES} min`,
    );

    for (const pending of expired) {
      try {
        // Delete the temp object from R2 (best-effort)
        await this.r2Service.deleteObject(pending.tmpKey);
      } catch {
        this.logger.warn(
          `Failed to delete R2 object ${pending.tmpKey} - may already be gone`,
        );
      }

      // Remove the pending record from DB
      await this.attachmentsService.deletePending(pending.id);
    }

    this.logger.log(
      `Cleanup complete - removed ${expired.length} pending upload(s) older than ${UploadCleanupService.EXPIRATION_MINUTES} minutes`,
    );
  }
}
