import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getProfile(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        role: import("./entities/user.entity").UserRole;
        createdAt: Date;
    }>;
    remove(): Promise<string>;
    register(userData: RegisterUserDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: import("./entities/user.entity").UserRole;
            createdAt: Date;
        };
    }>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateData: UpdateUserDto): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: import("./entities/user.entity").UserRole;
            createdAt: Date;
        };
    }>;
}
