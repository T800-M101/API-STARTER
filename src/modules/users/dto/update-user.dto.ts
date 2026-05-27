import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from './signup.dto';

export class UpdateUserDto extends PartialType(SignUpDto) {}
