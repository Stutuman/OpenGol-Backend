import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Club } from './entities/club.entity';
// Importamos la entidad User para que el módulo la conozca
import { User } from '../users/entities/user.entity'; // Ajustá esta ruta si es necesario

@Module({
  imports: [TypeOrmModule.forFeature([Club, User])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
