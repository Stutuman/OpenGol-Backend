import{IsString,IsNotEmpty,IsOptional,Matches,IsBoolean,Equals} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClubDto {
    @ApiProperty({example:'El Templo Futbol',description:'nombre del complejo deportivo'})
    @IsString()
    @IsNotEmpty({message: 'name of the club is obligatory'})
    name:string;

    @ApiProperty({ example: 'Av. Mitre 1234, Berazategui', description: 'Dirección física del club' })
    @IsString()
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address: string;

    @ApiProperty({example: '+5491112345678',description: 'telefono de contacto*opcional',required: false})
    @IsString()
    @IsOptional()
    phone?:string;
    @ApiProperty({ example: '08:00', description: 'Horario de apertura (formato HH:mm)' })
    @IsString()
    @IsNotEmpty()
    //Esta expresión regular (Regex) obliga a que la hora sea exactamente HH:mm
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
      message: 'El horario de apertura debe tener el formato HH:mm (ej: 08:30)' 
    })
    openingTime: string;
    @ApiProperty({ example: '23:00', description: 'Horario de cierre (formato HH:mm)' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
      message: 'El horario de cierre debe tener el formato HH:mm (ej: 23:00)' 
    })
    closingTime: string;

    @ApiProperty({ example: true, description: 'Aceptación explícita de los Términos y Condiciones' })
    @IsBoolean()
    @IsNotEmpty()
    //  Validamos que el valor sea ESTRICTAMENTE true. Si mandan false, rebota.
    @Equals(true, { message: 'Debes aceptar los Términos y Condiciones para registrar un club' })
    termsAccepted: boolean;
}
