import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Param,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/get-current-user.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { Role, User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from 'src/core/database/prisma.service';
import { UserPayload } from '../auth/interface/user-payload.interace';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Find user by ID (or profile if "me" is used)' })
  async findOne(@Param('id') id: string, @CurrentUser() user: UserPayload): Promise<UserEntity> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (id !== 'me' && !isUuid) {
      throw new BadRequestException( 'Invalid ID format. Must be a UUID or "me".' );
    }
    
    const myId = user.sub || user.userId; 
    const targetId = id === 'me' ? myId : id;
    const isOwner = user.sub === targetId;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot access this resource');
    }

    return this.usersService.findOneById(targetId);
  }

  @Patch(':id')
  update( @CurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto ): Promise<UserEntity> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@CurrentUserId() userId: string): Promise<UserEntity> {
    return this.usersService.remove(userId);
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new UserEntity(user);
  }
}
