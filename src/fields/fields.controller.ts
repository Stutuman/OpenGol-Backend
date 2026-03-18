import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
@ApiTags('fields') 
@Controller('api/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.createField(createFieldDto);
  }
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.fieldsService.findAll();
  }
  
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('club/:clubId')
  @ApiParam({ name: 'clubId', description: 'ID del club', example: 0 })
  findFieldsByClub(
    @Param('clubId', ParseIntPipe) clubId: number 
  ) {
    return this.fieldsService.findByClub(clubId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(+id, updateFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldsService.remove(+id);
  }
}
