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
exports.FieldsController = void 0;
const common_1 = require("@nestjs/common");
const fields_service_1 = require("./fields.service");
const create_field_dto_1 = require("./dto/create-field.dto");
const update_field_dto_1 = require("./dto/update-field.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/auth.guard");
const swagger_2 = require("@nestjs/swagger");
let FieldsController = class FieldsController {
    fieldsService;
    constructor(fieldsService) {
        this.fieldsService = fieldsService;
    }
    create(createFieldDto, req) {
        const userId = req.user.sub;
        return this.fieldsService.createField(createFieldDto, userId);
    }
    findAll() {
        return this.fieldsService.findAll();
    }
    findFieldsByClub(clubId) {
        return this.fieldsService.findByClub(clubId);
    }
    update(id, updateFieldDto, req) {
        const userId = req.user.sub;
        return this.fieldsService.update(id, updateFieldDto, userId);
    }
    remove(id, req) {
        const userId = req.user.sub;
        return this.fieldsService.remove(id, userId);
    }
};
exports.FieldsController = FieldsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_field_dto_1.CreateFieldDto, Object]),
    __metadata("design:returntype", void 0)
], FieldsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FieldsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('club/:clubId'),
    (0, swagger_2.ApiParam)({ name: 'clubId', description: 'ID del club', example: 0 }),
    __param(0, (0, common_1.Param)('clubId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FieldsController.prototype, "findFieldsByClub", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_2.ApiParam)({
        name: 'id',
        description: 'El ID único de la cancha que querés modificar',
        type: Number,
        example: 1,
        required: true,
    }),
    (0, swagger_2.ApiBody)({
        description: 'Enviá únicamente los campos que querés modificar',
        type: update_field_dto_1.UpdateFieldDto,
        examples: {
            ejemploPrecio: {
                summary: 'Actualizar precio y descripción',
                value: {
                    pricePerHour: 25000,
                    description: "Cancha 1 - Ahora con césped sintético nuevo"
                }
            },
            ejemploEstado: {
                summary: 'Pausar alquiler de cancha',
                value: {
                    isActive: false
                }
            }
        }
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_field_dto_1.UpdateFieldDto, Object]),
    __metadata("design:returntype", void 0)
], FieldsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_2.ApiOperation)({ summary: 'Eliminar una cancha (Soft Delete)' }),
    (0, swagger_2.ApiParam)({ name: 'id', description: 'ID de la cancha a dar de baja', type: Number, example: 1 }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], FieldsController.prototype, "remove", null);
exports.FieldsController = FieldsController = __decorate([
    (0, swagger_2.ApiTags)('fields'),
    (0, common_1.Controller)('api/fields'),
    __metadata("design:paramtypes", [fields_service_1.FieldsService])
], FieldsController);
//# sourceMappingURL=fields.controller.js.map