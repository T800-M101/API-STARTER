import { Controller, Get, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUserId } from 'src/common/decorators/get-current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt.guard';
import { OwnershipGuard } from 'src/common/guards/auth/ownership.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { Role } from '@prisma/client';


@UseGuards(JwtAuthGuard, OwnershipGuard) 
@ApiBearerAuth('access-token')
@Controller('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN) 
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@CurrentUserId() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':id')
  update(@CurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@CurrentUserId() userId: string) {
    return this.usersService.remove(userId);
  }

}
