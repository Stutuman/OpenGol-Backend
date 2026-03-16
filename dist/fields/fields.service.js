"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsService = void 0;
const common_1 = require("@nestjs/common");
let FieldsService = class FieldsService {
    create(createFieldDto) {
        return 'This action adds a new field';
    }
    findAll() {
        return `This action returns all fields`;
    }
    findOne(id) {
        return `This action returns a #${id} field`;
    }
    update(id, updateFieldDto) {
        return `This action updates a #${id} field`;
    }
    remove(id) {
        return `This action removes a #${id} field`;
    }
};
exports.FieldsService = FieldsService;
exports.FieldsService = FieldsService = __decorate([
    (0, common_1.Injectable)()
], FieldsService);
//# sourceMappingURL=fields.service.js.map