import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { User } from 'src/users/entities/user.entity';
export declare class ClubService {
    private clubRepository;
    private userRepository;
    constructor(clubRepository: Repository<Club>, userRepository: Repository<User>);
    create(createClubDto: CreateClubDto, userId: number): Promise<{
        message: string;
        club: Club;
    }>;
    approveClub(id: number): Promise<{
        message: string;
        club: Club;
    }>;
    findAll(): Promise<Club[]>;
    findApproved(): Promise<Club[]>;
    update(id: number, updateClubDto: UpdateClubDto, userId: number): Promise<{
        message: string;
        club: Club;
    }>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
}
