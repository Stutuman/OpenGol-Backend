import { IsString,IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CancelBookingDto{
    @ApiProperty({
        example: 'llovio torrencialmente y se inundo la cancha',
        description: 'motivo por el cual se cancela la reserva'
    })
    @IsString()
    @IsNotEmpty()
    cancellationReason:string;
}