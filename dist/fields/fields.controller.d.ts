import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
export declare class FieldsController {
    private readonly fieldsService;
    constructor(fieldsService: FieldsService);
    create(createFieldDto: CreateFieldDto): Promise<{
        message: string;
        field: import("./entities/field.entity").Field;
    }>;
    findAll(): Promise<import("./entities/field.entity").Field[]>;
    findFieldsByClub(clubId: number): Promise<import("./entities/field.entity").Field[]>;
    update(id: number, updateFieldDto: UpdateFieldDto): Promise<{
        message: string;
        field: import("./entities/field.entity").Field;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
