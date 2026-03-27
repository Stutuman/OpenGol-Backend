import { Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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

  findAll() {
    return `This action returns all club`;
  }

  findOne(id: number) {
    return `This action returns a #${id} club`;
  }

  update(id: number, updateClubDto: UpdateClubDto) {
    return `This action updates a #${id} club`;
  }

  remove(id: number) {
    return `This action removes a #${id} club`;
  }
}
