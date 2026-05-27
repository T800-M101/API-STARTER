import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/auth/jwt.guard';
import { JwtRefreshAuthGuard } from '../../common/guards/auth/jwt-refresh.guard';
import {
  ApiLogin,
  ApiLogout,
  ApiProfile,
  ApiRefresh,
  ApiSignUp,
} from 'src/common/decorators/api-auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserId,
  RefreshToken,
} from 'src/common/decorators/get-current-user.decorator';
import { SignUpDto } from '../users/dto/signup.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserEntity } from '../users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  
  constructor( private readonly authService: AuthService ) {}

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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiProfile()
  async getProfile(@CurrentUser() user: any): Promise<UserEntity> {
    return user;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh-token')
  @ApiRefresh()
  async refresh(
    @CurrentUserId() userId: string,
    @RefreshToken() token: string,
  ): Promise<LoginResponseDto> {
    return this.authService.refreshToken(userId, token);
  }
}
