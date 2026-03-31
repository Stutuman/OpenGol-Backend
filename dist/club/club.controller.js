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
exports.ClubController = void 0;
const common_1 = require("@nestjs/common");
const club_service_1 = require("./club.service");
const create_club_dto_1 = require("./dto/create-club.dto");
const update_club_dto_1 = require("./dto/update-club.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
let ClubController = class ClubController {
    clubService;
    constructor(clubService) {
        this.clubService = clubService;
    }
    create(createClubDto, req) {
        const userId = req.user.sub;
        return this.clubService.create(createClubDto, userId);
    }
    approveClub(id) {
        return this.clubService.approveClub(id);
    }
    findAll() {
        return this.clubService.findAll();
    }
    findApproved() {
        return this.clubService.findApproved();
    }
    update(id, updateClubDto, req) {
        const userId = req.user.sub;
        return this.clubService.update(id, updateClubDto, userId);
    }
    remove(id, req) {
        const userId = req.user.sub;
        return this.clubService.remove(id, userId);
    }
};
exports.ClubController = ClubController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'regustrar nuevo complejo' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_club_dto_1.CreateClubDto, Object]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Aprobar un club y ascender al creador a OWNER (Uso interno)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del club a aprobar', example: 1 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "approveClub", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los clubes disponibles y aprobados' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "findApproved", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Modificar los datos de tu club (Solo para el dueño)' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_club_dto_1.UpdateClubDto, Object]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar tu club lógicamente (Solo para el dueño)' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "remove", null);
exports.ClubController = ClubController = __decorate([
    (0, common_1.Controller)('club'),
    __metadata("design:paramtypes", [club_service_1.ClubService])
], ClubController);
//# sourceMappingURL=club.controller.js.map