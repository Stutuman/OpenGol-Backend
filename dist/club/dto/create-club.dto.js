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
exports.CreateClubDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateClubDto {
    name;
    address;
    phone;
    openingTime;
    closingTime;
    termsAccepted;
}
exports.CreateClubDto = CreateClubDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'El Templo Futbol', description: 'nombre del complejo deportivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'name of the club is obligatory' }),
    __metadata("design:type", String)
], CreateClubDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Av. Mitre 1234, Berazategui', description: 'Dirección física del club' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La dirección es obligatoria' }),
    __metadata("design:type", String)
], CreateClubDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+5491112345678', description: 'telefono de contacto*opcional', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateClubDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00', description: 'Horario de apertura (formato HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'El horario de apertura debe tener el formato HH:mm (ej: 08:30)'
    }),
    __metadata("design:type", String)
], CreateClubDto.prototype, "openingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '23:00', description: 'Horario de cierre (formato HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: 'El horario de cierre debe tener el formato HH:mm (ej: 23:00)'
    }),
    __metadata("design:type", String)
], CreateClubDto.prototype, "closingTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Aceptación explícita de los Términos y Condiciones' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Equals)(true, { message: 'Debes aceptar los Términos y Condiciones para registrar un club' }),
    __metadata("design:type", Boolean)
], CreateClubDto.prototype, "termsAccepted", void 0);
//# sourceMappingURL=create-club.dto.js.map