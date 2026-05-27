import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  
  @ApiProperty({ example: 'developer@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsNotEmpty({ message: 'A password is required.' })
  @MinLength(8)
  password!: string;
}