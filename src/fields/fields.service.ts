import { Injectable,InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';
import { Club } from 'src/club/entities/club.entity';

@Injectable()
export class FieldsService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
  ){}

  async createField(fieldDto: CreateFieldDto,userId:number) {
    try{
      const club = await this.clubRepository.findOneBy({id:fieldDto.clubId})

      if(!club){
        throw new NotFoundException(`el club con ID ${fieldDto.clubId} no existe`);
      }

      if(club.ownerId !==userId){
        throw new UnauthorizedException('no puedes agregar canchas en clubes ajenos');
      }
      const newField= this.fieldRepository.create(fieldDto);
      await this.fieldRepository.save(newField);
      return {
        message:'field successfuly registered',
        field:newField
      };
    } catch(error){
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Ocurrió un error al registrar la cancha');
    
    }
    
  }

  async findAll() {
    try{
      const fields = await this.fieldRepository.find();
      return fields;
    } catch(error){
      console.error(error);
      throw new InternalServerErrorException('An error occurred');
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
      throw new InternalServerErrorException('An error occurred');
    }
  }

  async update(id: number, updateFieldDto: UpdateFieldDto, userId: number) {
    try {
      // 1. Buscamos la cancha
      const foundField = await this.fieldRepository.findOneBy({ id });
      if (!foundField) {
        throw new NotFoundException(`The field with id ${id} doesnt exist`);
      }

      // 2. Buscamos el club al que pertenece esa cancha para ver quién es el dueño
      const club = await this.clubRepository.findOneBy({ id: foundField.clubId });
      
      // 3. BARRERA DE SEGURIDAD
      if (!club || club.ownerId !== userId) {
        throw new UnauthorizedException('No tienes permiso para modificar canchas de otros clubes');
      }

      const updateField = this.fieldRepository.merge(foundField, updateFieldDto);
      await this.fieldRepository.save(updateField);
      
      return {
        message: 'field updated successfully',
        field: updateField
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la cancha');
    }
  }

  async remove(id: number, userId: number) {
    try {
      // 1. Buscamos la cancha
      const foundField = await this.fieldRepository.findOneBy({ id });
      if (!foundField) {
        throw new NotFoundException(`field with id ${id} does not exist`);
      }

      // 2. Buscamos el club al que pertenece
      const club = await this.clubRepository.findOneBy({ id: foundField.clubId });

      // 3. BARRERA DE SEGURIDAD
      if (!club || club.ownerId !== userId) {
        throw new UnauthorizedException('No tienes permiso para eliminar canchas de otros clubes');
      }

      await this.fieldRepository.softDelete(id);
      return {
        message: `Field with id ${id} successfully Deleted`
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error(error);
      // QA TIP: Acá tenías un mensaje copiado y pegado de los usuarios. ¡Ya lo corregí!
      throw new InternalServerErrorException('An error occurred while deleting the field');
    }
  }
}
