import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
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
import { JwtService } from '@nestjs/jwt';
import {
  CurrentUser,
  CurrentUserId,
} from 'src/common/decorators/get-current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @ApiSignUp()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @Post('login')
  @ApiLogin()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)       // 1. Execution: Do you have permission?
  @ApiBearerAuth('access-token') // 2. Documentation: Visual notification that a token is required
  @ApiLogout()                   // 3. Documentation: Response Details
  async logout(@CurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiProfile()
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
  
  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth('refresh-token')
  @ApiRefresh()
  async refresh(@CurrentUserId() userId: string) {
    return this.authService.refreshToken(userId);
  }

}
