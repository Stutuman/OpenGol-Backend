"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const field_entity_1 = require("./entities/field.entity");
const typeorm_2 = require("typeorm");
const club_entity_1 = require("../club/entities/club.entity");
let FieldsService = class FieldsService {
    fieldRepository;
    clubRepository;
    constructor(fieldRepository, clubRepository) {
        this.fieldRepository = fieldRepository;
        this.clubRepository = clubRepository;
    }
    async createField(fieldDto, userId) {
        try {
            const club = await this.clubRepository.findOneBy({ id: fieldDto.clubId });
            if (!club) {
                throw new common_1.NotFoundException(`el club con ID ${fieldDto.clubId} no existe`);
            }
            if (club.ownerId !== userId) {
                throw new common_1.UnauthorizedException('no puedes agregar canchas en clubes ajenos');
            }
            const newField = this.fieldRepository.create(fieldDto);
            await this.fieldRepository.save(newField);
            return {
                message: 'field successfuly registered',
                field: newField
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Ocurrió un error al registrar la cancha');
        }
    }
    async findAll() {
        try {
            const fields = await this.fieldRepository.find();
            return fields;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('An error occurred');
        }
    }
    async findByClub(clubId) {
        try {
            const fields = await this.fieldRepository.find({
                where: { clubId: clubId },
            });
            if (fields.length === 0) {
                throw new common_1.NotFoundException(`no fields found for club with id ${clubId}`);
            }
            return fields;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('An error occurred');
        }
    }
    async update(id, updateFieldDto, userId) {
        try {
            const foundField = await this.fieldRepository.findOneBy({ id });
            if (!foundField) {
                throw new common_1.NotFoundException(`The field with id ${id} doesnt exist`);
            }
            const club = await this.clubRepository.findOneBy({ id: foundField.clubId });
            if (!club || club.ownerId !== userId) {
                throw new common_1.UnauthorizedException('No tienes permiso para modificar canchas de otros clubes');
            }
            const updateField = this.fieldRepository.merge(foundField, updateFieldDto);
            await this.fieldRepository.save(updateField);
            return {
                message: 'field updated successfully',
                field: updateField
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Error al actualizar la cancha');
        }
    }
    async remove(id, userId) {
        try {
            const foundField = await this.fieldRepository.findOneBy({ id });
            if (!foundField) {
                throw new common_1.NotFoundException(`field with id ${id} does not exist`);
            }
            const club = await this.clubRepository.findOneBy({ id: foundField.clubId });
            if (!club || club.ownerId !== userId) {
                throw new common_1.UnauthorizedException('No tienes permiso para eliminar canchas de otros clubes');
            }
            await this.fieldRepository.softDelete(id);
            return {
                message: `Field with id ${id} successfully Deleted`
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('An error occurred while deleting the field');
        }
    }
};
exports.FieldsService = FieldsService;
exports.FieldsService = FieldsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(field_entity_1.Field)),
    __param(1, (0, typeorm_1.InjectRepository)(club_entity_1.Club)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FieldsService);
//# sourceMappingURL=fields.service.js.map