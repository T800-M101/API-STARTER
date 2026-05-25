import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'The email format is invalid.' })
  email!: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  password!: string;
}