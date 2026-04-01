// dto/confirm-upload.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmUploadDto {
  @ApiProperty({
    description: 'The tmpKey returned by the presign endpoint',
    example: 'tmp/550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  tmpKey!: string;
}
