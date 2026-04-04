import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';
import { Club } from 'src/club/entities/club.entity';
export declare class FieldsService {
    private fieldRepository;
    private clubRepository;
    constructor(fieldRepository: Repository<Field>, clubRepository: Repository<Club>);
    createField(fieldDto: CreateFieldDto, userId: number): Promise<{
        message: string;
        field: Field;
    }>;
    findAll(): Promise<Field[]>;
    findOne(id: number): Promise<Field>;
    findByClub(clubId: number): Promise<Field[]>;
    update(id: number, updateFieldDto: UpdateFieldDto, userId: number): Promise<{
        message: string;
        field: Field;
    }>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
}
