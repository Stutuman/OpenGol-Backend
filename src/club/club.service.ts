import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club, ClubStatus } from './entities/club.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository : Repository<Club>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}
  async create(createClubDto: CreateClubDto,userId:number){
    try {
      const { termsAccepted, ...clubData } = createClubDto;
      const newClub = this.clubRepository.create({
        ...clubData,
        ownerId:userId,
        termsAcceptedAt:new Date()
      })
      const savedClub = await this.clubRepository.save(newClub);
      return {
        message: 'El club fue registrado y está pendiente de aprobación.',
        club: savedClub,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Ocurrió un error al registrar el club.');
    }

  }
  async approveClub(id:number){
    try {
      const club = await this.clubRepository.findOneBy({id});
      if(!club){
        throw new NotFoundException(`el club con ID ${id} no existe`)
      }
      if(club.status===ClubStatus.APPROVED){
        return {message: 'el club ya estaba aprobado previamente.',club};
      }
      club.status=ClubStatus.APPROVED;
      const updatedClub=await this.clubRepository.save(club);
      const owner=await this.userRepository.findOneBy({id:club.ownerId});
      if(owner){
        owner.role=UserRole.OWNER;
        await this.userRepository.save(owner);
      }
      return {
        message: '¡Club aprobado exitosamente! El creador ahora es OWNER.',
        club: updatedClub
      };
      
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Error al intentar aprobar el club.');
    }
  }

  async findAll() {
    try {
      const clubs = await this.clubRepository.find();
      return clubs;
    
    } catch (error) {
    console.error(error);
    throw new InternalServerErrorException('An error occurred');
    }
  }

  async findApproved() {
    try {
      // Solo traemos los clubes que ya pasaron tu auditoría
      const clubs = await this.clubRepository.find({
        where: { status: ClubStatus.APPROVED },
      });

      return clubs;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al recuperar la lista de clubes');
    }
  }

  async update(id:number,updateClubDto:UpdateClubDto,userId:number){
    const club = await this.clubRepository.findOneBy({id});
    if(!club){
      throw new NotFoundException(`el club con ID ${id} no existe`);
    }
    if(club.ownerId !== userId){
      throw new UnauthorizedException(`no tienes permisos para actualizar un club que no te pertenec`);
    }

    const updatedClub = this.clubRepository.merge(club,updateClubDto);
    await this.clubRepository.save(updatedClub);
    return{
      message:'Club update succesfully',
      club:updatedClub
    };
  }

  async remove(id:number, userId:number){
    const club = await this.clubRepository.findOneBy({id});
    if (!club) {
      throw new NotFoundException(`El club con ID ${id} no existe.`);
    }

    if (club.ownerId !== userId) {
      throw new UnauthorizedException('No tienes permiso para eliminar este club.');
    }

    // Usamos softDelete para que quede el registro en la base de datos (deleted_at)
    await this.clubRepository.softDelete(id);

    return { message: 'Club eliminado correctamente (Soft Delete aplicado)' };
  }
}
