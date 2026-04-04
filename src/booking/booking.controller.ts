import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags,ApiBearerAuth,ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CancelBookingDto } from './dto/cancel-booking.dto';
@ApiTags('bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({summary: 'Crear una nueva reserva'})
  create(@Body() createBookingDto: CreateBookingDto, @Req() req:any) {
    const userId=req.user.sub;
    return this.bookingService.create(createBookingDto,userId);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una reserva indicando el motivo' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelBookingDto: CancelBookingDto,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    return this.bookingService.cancel(id, userId, cancelBookingDto);
  }



}
