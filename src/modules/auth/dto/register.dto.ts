import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'developer@example.com', description: 'The user email' })
  @IsEmail({}, { message: 'The email format is invalid.' })
  email!: string;
  
  @ApiProperty({ example: 'dev_user', description: 'The unique username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Strong password' })
  @IsNotEmpty()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  password!: string;
}