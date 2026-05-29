import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';

import * as bcrypt from 'bcrypt';

type UserForLogin = Pick<User, 'id' | 'email' | 'password' | 'role'>;
type UserForRefresh = Pick<
  User,
  'id' | 'email' | 'hashedRefreshToken' | 'role'
>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(signUpDto: SignUpDto): Promise<User> {
    const { email } = signUpDto;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('The email is already registered');
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: signUpDto.email,
        username: signUpDto.username,
        password: hashedPassword,
      },
    });
  }

  findAll(): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const dataToUpdate: any = { ...updateUserDto };

    if (updateUserDto.password) {
      const saltRounds = 10;
      dataToUpdate.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    dataToUpdate.hashedRefreshToken = null;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    return this.prisma.user.update({ where: { id }, data: updatedUser });
  }

  async remove(id: string): Promise<UserEntity> {
    return await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneForLogin(email: string): Promise<UserForLogin | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async findOneForRefresh(userId: string): Promise<UserForRefresh | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        hashedRefreshToken: true,
        role: true,
      },
    });
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
