import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    iniciarSesion(body: LoginUserDto): Promise<{
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
