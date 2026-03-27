
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole{
  PLAYER='PLAYER',
  OWNER='OWNER',
  ADMIN='ADMIN'
}
// Le decimos que esta clase representa a la tabla "usuarios" que armaste en pgAdmin
@Entity('users') 
export class User {
  
  // Esto avisa que es el ID principal y se autoincrementa (SERIAL)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  // unique: true evita que dos personas se registren con el mismo mail
  @Column({ length: 150, unique: true })
  email: string;

  @Column({ name: 'password_hash',length: 255 })
  passwordHash: string;

  // nullable: true significa que este campo no es obligatorio
  @Column({ length: 20, nullable: true })
  phone: string;
  @Column({
    type:'enum',
    enum:UserRole,
    default:UserRole.PLAYER
  })
  role:UserRole;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt:Date;
}