import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PaymentStatus } from '../entities/booking.entity';

export class UpdatePaymentDto {
  @ApiProperty({ 
    enum: PaymentStatus, 
    example: PaymentStatus.PAID,
    description: 'El nuevo estado del pago (PENDING, PARTIAL o PAID)' 
  })
  @IsEnum(PaymentStatus, { message: 'El estado de pago no es válido' })
  @IsNotEmpty()
  paymentStatus: PaymentStatus;
}