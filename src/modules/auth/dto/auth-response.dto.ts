import { UserEntity } from "src/modules/users/entities/user.entity";

export class AuthResponseDto {
  message!: string;
  accessToken!: string;
  refreshToken!: string;
  user?: UserEntity; 
}