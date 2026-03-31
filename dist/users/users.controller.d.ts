import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(request: any): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        role: import("./entities/user.entity").UserRole;
        createdAt: Date;
    }>;
    registerUser(registerUserDto: RegisterUserDto): Promise<{
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
    updateUser(request: any, body: UpdateUserDto): Promise<{
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
