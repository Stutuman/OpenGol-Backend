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
exports.ClubService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const club_entity_1 = require("./entities/club.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ClubService = class ClubService {
    clubRepository;
    userRepository;
    constructor(clubRepository, userRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
    }
    async create(createClubDto, userId) {
        try {
            const { termsAccepted, ...clubData } = createClubDto;
            const newClub = this.clubRepository.create({
                ...clubData,
                ownerId: userId,
                termsAcceptedAt: new Date()
            });
            const savedClub = await this.clubRepository.save(newClub);
            return {
                message: 'El club fue registrado y está pendiente de aprobación.',
                club: savedClub,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Ocurrió un error al registrar el club.');
        }
    }
    async approveClub(id) {
        try {
            const club = await this.clubRepository.findOneBy({ id });
            if (!club) {
                throw new common_1.NotFoundException(`el club con ID ${id} no existe`);
            }
            if (club.status === club_entity_1.ClubStatus.APPROVED) {
                return { message: 'el club ya estaba aprobado previamente.', club };
            }
            club.status = club_entity_1.ClubStatus.APPROVED;
            const updatedClub = await this.clubRepository.save(club);
            const owner = await this.userRepository.findOneBy({ id: club.ownerId });
            if (owner) {
                owner.role = user_entity_1.UserRole.OWNER;
                await this.userRepository.save(owner);
            }
            return {
                message: '¡Club aprobado exitosamente! El creador ahora es OWNER.',
                club: updatedClub
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error(error);
            throw new common_1.InternalServerErrorException('Error al intentar aprobar el club.');
        }
    }
    async findAll() {
        try {
            const clubs = await this.clubRepository.find();
            return clubs;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('An error occurred');
        }
    }
    async findApproved() {
        try {
            const clubs = await this.clubRepository.find({
                where: { status: club_entity_1.ClubStatus.APPROVED },
            });
            return clubs;
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Error al recuperar la lista de clubes');
        }
    }
    async update(id, updateClubDto, userId) {
        const club = await this.clubRepository.findOneBy({ id });
        if (!club) {
            throw new common_1.NotFoundException(`el club con ID ${id} no existe`);
        }
        if (club.ownerId !== userId) {
            throw new common_1.UnauthorizedException(`no tienes permisos para actualizar un club que no te pertenec`);
        }
        const updatedClub = this.clubRepository.merge(club, updateClubDto);
        await this.clubRepository.save(updatedClub);
        return {
            message: 'Club update succesfully',
            club: updatedClub
        };
    }
    async remove(id, userId) {
        const club = await this.clubRepository.findOneBy({ id });
        if (!club) {
            throw new common_1.NotFoundException(`El club con ID ${id} no existe.`);
        }
        if (club.ownerId !== userId) {
            throw new common_1.UnauthorizedException('No tienes permiso para eliminar este club.');
        }
        await this.clubRepository.softDelete(id);
        return { message: 'Club eliminado correctamente (Soft Delete aplicado)' };
    }
};
exports.ClubService = ClubService;
exports.ClubService = ClubService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(club_entity_1.Club)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ClubService);
//# sourceMappingURL=club.service.js.map