import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
export declare class ClubController {
    private readonly clubService;
    constructor(clubService: ClubService);
    create(createClubDto: CreateClubDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateClubDto: UpdateClubDto): string;
    remove(id: string): string;
}
