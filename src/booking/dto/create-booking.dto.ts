import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'ID de la cancha a reservar' })
  @IsInt()
  @IsNotEmpty()
  fieldId: number;

  @ApiProperty({ example: '2026-03-28', description: 'Fecha del partido (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: '20:00', description: 'Hora de inicio (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'El horario de inicio debe ser HH:mm' })
  startTime: string;

  @ApiProperty({ example: '21:00', description: 'Hora de fin (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'El horario de fin debe ser HH:mm' })
  endTime: string;

  // --- LOS DATOS DEL INVITADO (Opcionales) ---
  @ApiProperty({ example: 'Carlos (Llamó por teléfono)', description: 'Nombre si reserva sin cuenta', required: false })
  @IsString()
  @IsOptional()
  guestName?: string;

  @ApiProperty({ example: '+5491123456789', description: 'Teléfono del invitado', required: false })
  @IsString()
  @IsOptional()
  guestPhone?: string;
}
