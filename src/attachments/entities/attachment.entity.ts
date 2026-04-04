import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  entityId!: string;

  @Column({ type: 'varchar' })
  kind!: 'club-logo' | 'user-avatar' | 'field-image';

  @Column()
  objectKey!: string;

  @Column()
  publicUrl!: string;

  @Column()
  uploadedBy!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
