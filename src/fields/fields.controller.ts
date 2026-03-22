import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';

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
  findFieldsByClub(@Param('clubId', ParseIntPipe) clubId: number) {
    return this.fieldsService.findByClub(clubId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cancha por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cancha',
    type: Number,
    example: 1,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fieldsService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'El ID único de la cancha que querés modificar',
    type: Number,
    example: 1,
    required: true,
  })
  @ApiBody({
    description: 'Enviá únicamente los campos que querés modificar',
    type: UpdateFieldDto,
    examples: {
      ejemploPrecio: {
        summary: 'Actualizar precio y descripción',
        value: {
          pricePerHour: 25000,
          description: 'Cancha 1 - Ahora con césped sintético nuevo',
        },
      },
      ejemploEstado: {
        summary: 'Pausar alquiler de cancha',
        value: {
          isActive: false,
        },
      },
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(id, updateFieldDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cancha (Soft Delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cancha a dar de baja',
    type: Number,
    example: 1,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fieldsService.remove(id);
  }
}
