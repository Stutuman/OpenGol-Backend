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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBookingDto {
    fieldId;
    bookingDate;
    startTime;
    endTime;
    guestName;
    guestPhone;
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la cancha a reservar' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "fieldId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-28', description: 'Fecha del partido (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "bookingDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '20:00', description: 'Hora de inicio (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'El horario de inicio debe ser HH:mm' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '21:00', description: 'Hora de fin (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'El horario de fin debe ser HH:mm' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Carlos (Llamó por teléfono)', description: 'Nombre si reserva sin cuenta', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "guestName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+5491123456789', description: 'Teléfono del invitado', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "guestPhone", void 0);
//# sourceMappingURL=create-booking.dto.js.map