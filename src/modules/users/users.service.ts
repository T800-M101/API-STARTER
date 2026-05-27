import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';

import * as bcrypt from 'bcrypt';

type UserForLogin = Prisma.UserGetPayload<{ select: { id: true; email: true; password: true } }>;
type UserForRefresh = Prisma.UserGetPayload<{ select: { id: true; email: true; hashedRefreshToken: true } }>;

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

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
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

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
}
