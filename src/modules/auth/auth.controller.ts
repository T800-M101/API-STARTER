import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard';
import { JwtRefreshAuthGuard } from '../../common/guards/auth/jwt-refresh.guard';
import {
  ApiCreateAdmin,
  ApiLogin,
  ApiLogout,
  ApiRefresh,
  ApiSignUp,
} from 'src/common/decorators/api-auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUserId,
  RefreshToken,
} from 'src/common/decorators/get-current-user.decorator';
import { SignUpDto } from '../users/dto/signup.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { TokenPair } from './interface/token-pair.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/auth/roles.guard';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiSignUp()
  async signup(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiLogin()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard) // 1. Execution: Do you have permission?
  @ApiBearerAuth('access-token') // 2. Documentation: Visual notification that a token is required
  @ApiLogout() // 3. Documentation: Response Details
  async logout(@CurrentUserId() userId: string): Promise<{ message: string }> {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh-token')
  @ApiRefresh()
  async refresh(
    @CurrentUserId() userId: string,
    @RefreshToken() token: string,
  ): Promise<TokenPair> {
    return this.authService.refreshToken(userId, token);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiCreateAdmin()
  async createAdmin(@Body() createAdminDto: SignUpDto) {
    return this.authService.createAdmin(createAdminDto);
  }
}
