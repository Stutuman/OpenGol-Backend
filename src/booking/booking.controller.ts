import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiTags,ApiBearerAuth,ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
@ApiTags('bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('dashboard-stats') 
  @ApiOperation({ summary: 'Obtener estadísticas en tiempo real para el Dashboard' })
  getStats() {
    return this.bookingService.getDashboardStats();
  }
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
  @Get()
  @ApiOperation({ summary: 'Listar reservas por fecha, club y estado' })
  findAll(@Query() filters: GetBookingsFilterDto) {
    return this.bookingService.findAllWithFilters(filters);
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
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id/payment')
  @ApiOperation({ summary: 'Registrar pago total o parcial (seña) de la reserva' })
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.bookingService.updatePaymentStatus(id, updatePaymentDto);
  }



}
