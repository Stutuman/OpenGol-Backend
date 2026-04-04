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
exports.Club = exports.ClubStatus = void 0;
const typeorm_1 = require("typeorm");
var ClubStatus;
(function (ClubStatus) {
    ClubStatus["PENDING"] = "PENDING";
    ClubStatus["APPROVED"] = "APPROVED";
    ClubStatus["REJECTED"] = "REJECTED";
})(ClubStatus || (exports.ClubStatus = ClubStatus = {}));
let Club = class Club {
    id;
    name;
    address;
    phone;
    openingTime;
    closingTime;
    status;
    ownerId;
    termsAcceptedAt;
    strikes;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.Club = Club;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Club.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Club.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Club.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Club.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 5 }),
    __metadata("design:type", String)
], Club.prototype, "openingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 5 }),
    __metadata("design:type", String)
], Club.prototype, "closingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ClubStatus, default: ClubStatus.PENDING }),
    __metadata("design:type", String)
], Club.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Club.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Club.prototype, "termsAcceptedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Club.prototype, "strikes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Club.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Club.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Club.prototype, "deletedAt", void 0);
exports.Club = Club = __decorate([
    (0, typeorm_1.Entity)('clubs')
], Club);
//# sourceMappingURL=club.entity.js.map