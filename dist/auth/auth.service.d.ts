import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(datosLogin: LoginUserDto): Promise<{
        mensaje: string;
        usuario: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: import("../users/entities/user.entity").UserRole;
            createdAt: Date;
        };
        access_token: string;
    }>;
}
