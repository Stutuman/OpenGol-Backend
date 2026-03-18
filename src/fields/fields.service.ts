import { Injectable,InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';
import { intervalProvider } from 'rxjs/internal/scheduler/intervalProvider';

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

  async findAll() {
    try{
      const fields = await this.fieldRepository.find();
      return fields;
    } catch(error){
      console.error(error);
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  async findByClub(clubId : number){
    try {
      const fields= await this.fieldRepository.find({
      where:{ clubId: clubId},
    });
    if(fields.length===0){
      throw new NotFoundException(`no fields found for club with id ${clubId}`)
    }
    return fields;
    } catch (error) {
      if (error instanceof NotFoundException){
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  async update(id: number, updateFieldDto: UpdateFieldDto) {
    const foundField= await this.fieldRepository.findOneBy({id});
    if(!foundField){
      throw new NotFoundException(`The field with id ${id} doesnt exist`)
    }
    const updateField= this.fieldRepository.merge(foundField,updateFieldDto);
    await this.fieldRepository.save(updateField);
    return{
      message:'field updated successfully',
      field:updateField
    }
  }

  async remove(id: number) {
    try {
      const foundField= await this.fieldRepository.findOneBy({id});
      if(!foundField){
        throw new NotFoundException(`field with id ${id} does not exist`);
      }
      await this.fieldRepository.softDelete(id);
      return{
        message: `Field with id ${id} successfully Deleted`
      };
    }catch(error){
      if(error instanceof NotFoundException){
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }
}
