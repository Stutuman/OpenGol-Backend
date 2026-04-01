import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Club } from 'src/club/entities/club.entity';
import { Attachment } from '../attachments/entities/attachment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Field,Club,Attachment])],
  controllers: [FieldsController],
  providers: [FieldsService],
})
export class FieldsModule {}
