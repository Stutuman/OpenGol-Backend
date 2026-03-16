import { IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto{
    @ApiProperty({example:'leo@opengol.com'})
    @IsEmail({},{message:'El formato del correo electronico es invalido'})
    email:string;
    @ApiProperty({example:'contrasena123'})
    @MinLength(6,{message:'La contraseno debe tener al menos 6 caracteres'})
    password:string;
}