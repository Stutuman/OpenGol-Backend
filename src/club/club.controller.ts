import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(+id);
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
