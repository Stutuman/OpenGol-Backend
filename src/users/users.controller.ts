import { Controller, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Get, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users') // Swagger ahora lo agrupará bajo "users"
@Controller('api/users') // ⚠️ ATENCIÓN: La URL base cambió
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get('profile') // ⚠️ La ruta ahora es /api/users/profile
  async getProfile(@Req() request) {
    // The Guard injected the user ID into request.user.sub
    const userId = request.user.sub;
    return this.usersService.getProfile(userId);
  }

  @Post('register') // ⚠️ La ruta ahora es /api/users/register
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto); 
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Patch('profile') // ⚠️ La ruta ahora es /api/users/profile
  updateUser(
    @Req() request, 
    @Body() body: UpdateUserDto
  ) {
    const userId = request.user.sub; 
    return this.usersService.update(userId, body);
  }
  
}