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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFieldDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateFieldDto {
    name;
    description;
    isActive;
    format;
    photos;
    pricePerHour;
    freeCancellationHours;
    depositPrice;
    clubId;
}
exports.CreateFieldDto = CreateFieldDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'name of the field', example: 'fied 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFieldDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'description of field', example: 'cynthetic grass' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateFieldDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'is the field available for rent?', default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateFieldDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'field format or number of player', enum: [5, 7, 11], example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([5, 7, 11], { message: 'the field format can only be 5,7 or 11  ' }),
    __metadata("design:type", Number)
], CreateFieldDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URLs de las fotos de la cancha', type: [String], example: ['https://url-foto1.com', 'https://url-foto2.com'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateFieldDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio fijo por hora', example: 15000.50 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateFieldDto.prototype, "pricePerHour", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horas límite para cancelar gratis', example: 24, default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFieldDto.prototype, "freeCancellationHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Precio de la seña si aplica', example: 5000, default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateFieldDto.prototype, "depositPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del club al que pertenece (temporal hasta hacer la relación)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateFieldDto.prototype, "clubId", void 0);
//# sourceMappingURL=create-field.dto.js.map