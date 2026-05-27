import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(registerDto: RegisterDto) {
    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email: registerDto.email,
        },
      });

    if (existingUser) {
      throw new ConflictException(
        'The email is already registered',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        registerDto.password,
        10,
      );

    const user =
      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          username:
            registerDto.username,
          password:
            hashedPassword,
        },
      });

    return {
      message:
        'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

    const isPasswordValid =
      user
        ? await bcrypt.compare(
            loginDto.password,
            user.password,
          )
        : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException(
        'Wrong credentials',
      );
    }

    const tokens =
      await this.generateTokens(
        user.id,
        user.email,
      );

    await this.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    return {
      message:
        'Successful authentication',
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: null,
      },
    });

    return {
      message:
        'Logged out successfully',
    };
  }

  async refreshToken(
    userId: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          hashedRefreshToken: true,
        },
      });

    if (
      !user ||
      !user.hashedRefreshToken
    ) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    const tokens =
      await this.generateTokens(
        user.id,
        user.email,
      );

    await this.updateRefreshToken(
      user.id,
      tokens.refreshToken,
    );

    return tokens;
  }

private async generateTokens(
  userId: string,
  email: string,
) {
  const payload = {
    sub: userId,
    email,
  };

  const accessToken =
    await this.jwtService.signAsync(
      payload,
      {
        secret:
          this.configService.get<string>(
            'JWT_SECRET',
          ),

        expiresIn:
          this.configService.get<StringValue>(
            'JWT_ACCESS_EXPIRES_IN',
          ) ?? '60m',
      },
    );

  const refreshToken =
    await this.jwtService.signAsync(
      payload,
      {
        secret:
          this.configService.get<string>(
            'JWT_REFRESH_SECRET',
          ),

        expiresIn:
          this.configService.get<StringValue>(
            'JWT_REFRESH_EXPIRES_IN',
          ) ?? '7d',
      },
    );

  return {
    accessToken,
    refreshToken,
  };
}

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ) {
    const hashedRefreshToken =
      await bcrypt.hash(
        refreshToken,
        10,
      );

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }
}