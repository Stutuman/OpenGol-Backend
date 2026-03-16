import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterUserDto {
  @ApiProperty({example:'Lionel Messi', description:'el nombre no debe estar vacio'})
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString()
  name: string;
  @ApiProperty({example:'leo@opengol.com'})
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email: string;

  @ApiProperty({ 
    example: 'contrasena123', 
    description: 'La contraseña debe ser alfanumérica y tener mínimo 6 caracteres' 
  })

  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
  
  @IsString()
  @ApiProperty({example:'1137707135'})
  phone?: string;
}