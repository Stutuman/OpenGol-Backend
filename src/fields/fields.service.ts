import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>
  ){}
  async createField(fieldDto: CreateFieldDto) {
    try{
      const newField= this.fieldRepository.create(fieldDto);
      await this.fieldRepository.save(newField);
      return {
        message:'field successfuly registered',
        field:newField
      };
    } catch(error){
      console.error(error)
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
    
  }

  findAll() {
    return `This action returns all fields`;
  }

  findOne(id: number) {
    return `This action returns a #${id} field`;
  }

  update(id: number, updateFieldDto: UpdateFieldDto) {
    return `This action updates a #${id} field`;
  }

  remove(id: number) {
    return `This action removes a #${id} field`;
  }
}
