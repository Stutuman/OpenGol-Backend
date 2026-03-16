import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
export declare class FieldsService {
    create(createFieldDto: CreateFieldDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFieldDto: UpdateFieldDto): string;
    remove(id: number): string;
}
