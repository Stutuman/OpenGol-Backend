import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pending_uploads')
export class PendingUpload {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** The tmp/ object key in R2 */
  @Column()
  tmpKey!: string;

  @Column({ type: 'varchar' })
  kind!: 'club-logo' | 'user-avatar' | 'field-image';

  @Column()
  entityId!: string;

  @Column()
  mimeType!: string;

  @Column()
  originalFileName!: string;

  @Column()
  uploadedBy!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
