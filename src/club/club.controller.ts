import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({summary:'regustrar nuevo complejo'})
  create(@Body() createClubDto: CreateClubDto,
   @Req() req:any) {
    const userId=req.user.sub;
    return this.clubService.create(createClubDto,userId);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard) // Más adelante le agregaremos un Guard para que solo vos (SUPER_ADMIN) puedas pegarle a esto
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprobar un club y ascender al creador a OWNER (Uso interno)' })
  @ApiParam({ name: 'id', description: 'ID del club a aprobar', example: 1 })
  approveClub(@Param('id', ParseIntPipe) id: number) {
    return this.clubService.approveClub(id);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.clubService.findAll();
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos los clubes disponibles y aprobados' })
  findApproved() {
    return this.clubService.findApproved();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubDto: UpdateClubDto) {
    return this.clubService.update(+id, updateClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubService.remove(+id);
  }
}
