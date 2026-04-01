import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { PendingUpload } from './entities/pending-upload.entity';
import { User } from '../users/entities/user.entity';
import { Club } from '../club/entities/club.entity';
import { Field } from '../fields/entities/field.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: Repository<Attachment>,
    @InjectRepository(PendingUpload)
    private readonly pendingRepo: Repository<PendingUpload>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Club)
    private readonly clubRepo: Repository<Club>,
    @InjectRepository(Field)
    private readonly fieldRepo: Repository<Field>,
  ) {}

  // ── Pending uploads ────────────────────────────────────────────────
  async createPending(params: {
    tmpKey: string;
    kind: 'club-logo' | 'user-avatar' | 'field-image';
    entityId: string;
    mimeType: string;
    originalFileName: string;
    uploadedBy: string;
  }): Promise<PendingUpload> {
    const pending = this.pendingRepo.create(params);
    return this.pendingRepo.save(pending);
  }

  async findPendingByTmpKey(tmpKey: string): Promise<PendingUpload | null> {
    return this.pendingRepo.findOne({ where: { tmpKey } });
  }

  async deletePending(id: string): Promise<void> {
    await this.pendingRepo.delete(id);
  }

  /** Find all pending uploads older than `minutes` using DB time */
  async findExpiredPending(minutes: number): Promise<PendingUpload[]> {
    return this.pendingRepo
      .createQueryBuilder('pending')
      .where(`pending.createdAt < NOW() - (:minutes * INTERVAL '1 minute')`, {
        minutes,
      })
      .orderBy('pending.createdAt', 'ASC')
      .getMany();
  }

  // ── Confirmed attachments ──────────────────────────────────────────
  async create(params: {
    entityId: string;
    kind: 'club-logo' | 'user-avatar' | 'field-image';
    objectKey: string;
    publicUrl: string;
    uploadedBy: string;
  }): Promise<Attachment> {
    const att = this.repo.create(params);
    return this.repo.save(att);
  }

  async findById(id: string): Promise<Attachment | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findManyByIds(ids: string[]): Promise<Attachment[]> {
    if (ids.length === 0) {
      return [];
    }

    return this.repo
      .createQueryBuilder('attachment')
      .where('attachment.id IN (:...ids)', { ids })
      .andWhere('attachment.deletedAt IS NULL')
      .getMany();
  }

  async linkAttachmentReference(attachment: Attachment): Promise<void> {
    switch (attachment.kind) {
      case 'user-avatar': {
        await this.userRepo.update(
          { id: Number(attachment.entityId) },
          { avatarAttachmentId: attachment.id },
        );
        return;
      }
      case 'club-logo': {
        await this.clubRepo.update(
          { id: Number(attachment.entityId) },
          { logoAttachmentId: attachment.id },
        );
        return;
      }
      case 'field-image': {
        const field = await this.fieldRepo.findOneBy({
          id: Number(attachment.entityId),
        });
        if (!field) {
          throw new NotFoundException('Field not found for attachment');
        }

        field.imageAttachmentIds = Array.from(
          new Set([...(field.imageAttachmentIds ?? []), attachment.id]),
        );
        field.photos = Array.from(
          new Set([...(field.photos ?? []), attachment.publicUrl]),
        );

        await this.fieldRepo.save(field);
        return;
      }
    }
  }

  async unlinkAttachmentReference(attachment: Attachment): Promise<void> {
    switch (attachment.kind) {
      case 'user-avatar': {
        const user = await this.userRepo.findOneBy({
          id: Number(attachment.entityId),
        });
        if (user?.avatarAttachmentId === attachment.id) {
          user.avatarAttachmentId = null;
          await this.userRepo.save(user);
        }
        return;
      }
      case 'club-logo': {
        const club = await this.clubRepo.findOneBy({
          id: Number(attachment.entityId),
        });
        if (club?.logoAttachmentId === attachment.id) {
          club.logoAttachmentId = null;
          await this.clubRepo.save(club);
        }
        return;
      }
      case 'field-image': {
        const field = await this.fieldRepo.findOneBy({
          id: Number(attachment.entityId),
        });
        if (!field) {
          return;
        }

        field.imageAttachmentIds = (field.imageAttachmentIds ?? []).filter(
          (attachmentId) => attachmentId !== attachment.id,
        );
        field.photos = (field.photos ?? []).filter(
          (publicUrl) => publicUrl !== attachment.publicUrl,
        );

        await this.fieldRepo.save(field);
        return;
      }
    }
  }

  async softDelete(id: string): Promise<void> {
    const res = await this.repo.softDelete(id);
    if (res.affected === 0) {
      throw new NotFoundException('Asset not found');
    }
  }
}
