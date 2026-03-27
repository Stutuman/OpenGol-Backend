import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
export declare class ClubController {
    private readonly clubService;
    constructor(clubService: ClubService);
    create(createClubDto: CreateClubDto, req: any): Promise<{
        message: string;
        club: import("./entities/club.entity").Club;
    }>;
    approveClub(id: number): Promise<{
        message: string;
        club: import("./entities/club.entity").Club;
    }>;
    findAll(): Promise<import("./entities/club.entity").Club[]>;
    findApproved(): Promise<import("./entities/club.entity").Club[]>;
    update(id: number, updateClubDto: UpdateClubDto, req: any): Promise<{
        message: string;
        club: import("./entities/club.entity").Club;
    }>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
