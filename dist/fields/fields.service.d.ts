import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';
export declare class FieldsService {
    private fieldRepository;
    constructor(fieldRepository: Repository<Field>);
    createField(fieldDto: CreateFieldDto): Promise<{
        message: string;
        field: Field;
    }>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFieldDto: UpdateFieldDto): string;
    remove(id: number): string;
}
