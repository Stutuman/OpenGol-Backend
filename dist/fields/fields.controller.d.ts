import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
export declare class FieldsController {
    private readonly fieldsService;
    constructor(fieldsService: FieldsService);
    create(createFieldDto: CreateFieldDto, req: any): Promise<{
        message: string;
        field: import("./entities/field.entity").Field;
    }>;
    findAll(): Promise<import("./entities/field.entity").Field[]>;
    findFieldsByClub(clubId: number): Promise<import("./entities/field.entity").Field[]>;
    findOne(id: number): Promise<import("./entities/field.entity").Field>;
    update(id: number, updateFieldDto: UpdateFieldDto, req: any): Promise<{
        message: string;
        field: import("./entities/field.entity").Field;
    }>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
