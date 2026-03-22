import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from "class-validator";

export class CreateFieldDto {
    @ApiProperty({description:'name of the field',example:'fied 1'})
    @IsString()
    @MaxLength(100)
    name:string;
    @ApiPropertyOptional({description:'description of field',example:'cynthetic grass'})
    @IsString()
    @IsOptional()
    description?:string;
    @ApiPropertyOptional({description:'is the field available for rent?',default:true})
    @IsBoolean()
    @IsOptional()
    isActive?:true;
    @ApiProperty({description:'field format or number of player',enum:[5,7,11],example:5})
    @IsInt()
    @IsIn([5,7,11],{message:'the field format can only be 5,7 or 11  '})
    format:number;
    @ApiPropertyOptional({ description: 'URLs de las fotos de la cancha', type: [String], example: ['https://url-foto1.com', 'https://url-foto2.com'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    photos?:string[];
    @ApiProperty({ description: 'Precio fijo por hora', example: 15000.50 })
    @IsNumber()
    @IsPositive()
    pricePerHour:number;
    @ApiPropertyOptional({ description: 'Horas límite para cancelar gratis', example: 24, default: 0 })
    @IsInt()
    @Min(0)
    @IsOptional()
    freeCancellationHours?:number;
    @ApiPropertyOptional({ description: 'Precio de la seña si aplica', example: 5000, default: 0 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    depositPrice:number;
    @ApiPropertyOptional({ description: 'ID del club al que pertenece (temporal hasta hacer la relación)' })
    @IsInt()
    @IsOptional()
    clubId:number;

}
