import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
export declare class ClubService {
    create(createClubDto: CreateClubDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateClubDto: UpdateClubDto): string;
    remove(id: number): string;
}
