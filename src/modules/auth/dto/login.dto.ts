import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email!: string;

  @IsNotEmpty({ message: 'A password is required.' })
  @MinLength(8)
  password!: string;
}