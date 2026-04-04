import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetBookingsFilterDto {
  @ApiPropertyOptional({ description: 'ID del club', example: '1' })
  @IsString()
  @IsOptional()
  clubId?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio (YYYY-MM-DD)', example: '2026-03-30' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin (YYYY-MM-DD)', example: '2026-04-05' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: '¿Mostrar las reservas canceladas? (true/false)', example: 'false' })
  @IsString()
  @IsOptional()
  includeCancelled?: string;
}