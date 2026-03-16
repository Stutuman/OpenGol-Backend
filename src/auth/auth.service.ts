import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}
    async login(datosLogin: LoginUserDto) {
    const { email, password } = datosLogin;

    // 1. Usamos la función nuevita que creamos en el paso anterior
    const usuarioEncontrado = await this.usersService.findByEmail(email);

    if (!usuarioEncontrado) {
      throw new UnauthorizedException('Credenciales inválidas. Revisá tu correo o contraseña.');
    }

    // 2. Comparamos claves
    const laClaveCoincide = await bcrypt.compare(password, usuarioEncontrado.passwordHash);
    if (!laClaveCoincide) {
      throw new UnauthorizedException('Credenciales inválidas. Revisá tu correo o contraseña.');
    }

    // 3. Limpiamos y fabricamos el Token
    const { passwordHash, ...usuarioSeguro } = usuarioEncontrado;
    const payload = { sub: usuarioEncontrado.id, email: usuarioEncontrado.email };
    const tokenVip = await this.jwtService.signAsync(payload);

    return {
      mensaje: '¡Inicio de sesión exitoso! Bienvenido a openGol.',
      usuario: usuarioSeguro,
      access_token: tokenVip
    };
  }
}
