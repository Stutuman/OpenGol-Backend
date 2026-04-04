import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsController } from './uploads.controller';
import { R2Service } from './R2Service.service';
import { Attachment } from './entities/attachment.entity';
import { PendingUpload } from './entities/pending-upload.entity';
import { AttachmentsService } from './attachments.service';
import { ImageProcessingService } from './image-processing.service';
import { UploadCleanupService } from './upload-cleanup.service';
import { User } from '../users/entities/user.entity';
import { Club } from '../club/entities/club.entity';
import { Field } from '../fields/entities/field.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, PendingUpload, User, Club, Field]),
    ConfigModule,
  ],
  controllers: [UploadsController],
  providers: [
    AttachmentsService,
    R2Service,
    ImageProcessingService,
    UploadCleanupService,
  ],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
