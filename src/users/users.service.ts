import { Injectable, UnauthorizedException, InternalServerErrorException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Asegurate de renombrar el archivo a user.entity.ts
import { Attachment } from '../attachments/entities/attachment.entity';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto'; // Renombrar archivo
import { UpdateUserDto } from './dto/update-user.dto'; // Renombrar archivo

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async getProfile(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.serializeUser(user);  
  }

  async remove() {
    return 'I delete the user'; 
  }

  async register(userData: RegisterUserDto) {
    try {
      const { name, email, password, phone } = userData;

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = this.userRepository.create({
        name,
        email,
        passwordHash: hashedPassword, // Usamos camelCase como en tu nueva entidad
        phone,
      });

      // Acá estaba el bug: cambié nuevoUsuario por newUser
      await this.userRepository.save(newUser);

      const { passwordHash, ...safeUser } = newUser;

      return {
        message: 'User successfully registered to play!',
        user: safeUser
      };

    } catch (error) {
      console.error(error);
      // 23505 unique violation error from PostgreSQL
      if (error.code === '23505') {
        throw new ConflictException('This email is already registered in openGol. Try logging in!');
      }
      throw new InternalServerErrorException('An error occurred while registering the user');
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email: email }
    });
  }

  async update(id: number, updateData: UpdateUserDto) {
    const foundUser = await this.userRepository.findOneBy({ id });

    if (!foundUser) {
      throw new NotFoundException(`The player with ID ${id} does not exist`);
    }

    // Si cambia la contraseña, la hasheamos
    if (updateData.password) {
      const saltRounds = 10;
      foundUser.passwordHash = await bcrypt.hash(updateData.password, saltRounds);
      delete updateData.password; 
    }

    // Merge de datos
    const updatedUser = this.userRepository.merge(foundUser, updateData);
    await this.userRepository.save(updatedUser);
    
    return {
      message: 'Profile updated successfully!',
      user: await this.serializeUser(updatedUser),
    };
  }

  private async serializeUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    const avatar = user.avatarAttachmentId
      ? await this.attachmentRepository.findOne({
          where: { id: user.avatarAttachmentId },
        })
      : null;

    return {
      ...safeUser,
      avatarUrl: avatar?.publicUrl ?? null,
    };
  }
}