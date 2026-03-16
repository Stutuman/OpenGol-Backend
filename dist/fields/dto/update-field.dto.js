"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFieldDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_field_dto_1 = require("./create-field.dto");
class UpdateFieldDto extends (0, swagger_1.PartialType)(create_field_dto_1.CreateFieldDto) {
}
exports.UpdateFieldDto = UpdateFieldDto;
//# sourceMappingURL=update-field.dto.js.map