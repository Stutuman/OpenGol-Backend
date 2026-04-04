// dto/create-upload-url.dto.ts
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadUrlDto {
  @ApiProperty({
    enum: ['club-logo', 'user-avatar', 'field-image'],
    example: 'user-avatar',
  })
  @IsEnum(['club-logo', 'user-avatar', 'field-image'])
  kind!: 'club-logo' | 'user-avatar' | 'field-image';

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty({ example: 'avatar.png', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  originalFileName!: string;
}
