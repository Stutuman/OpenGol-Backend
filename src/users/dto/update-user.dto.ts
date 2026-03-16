import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
export class UpdateUserDto {
    @ApiProperty({ example: 'Cristiano Ronaldo', required: false })
    @IsOptional()
    @IsString()
    name?:string;
    @ApiProperty({ example: 'leo1@opengol.com', required: false })
    @IsOptional()
    @IsEmail()
    email?:string;
    @ApiProperty({ example: '123456', required: false })
    @IsOptional()
    @MinLength(6)
    password?:string;
    @ApiProperty({ example: '1122334455', required: false })
    @IsOptional()
    @IsString()
    phone?: string;
    

}