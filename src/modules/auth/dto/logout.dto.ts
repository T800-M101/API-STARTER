import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ 
    description: 'Logout confirmation message', 
    example: 'Successfully logged out' 
  })
  message!: string;

  @ApiProperty({ 
    description: 'User ID of the user who logged out', 
    example: 'f39dc021-6159-492b-bfb0-d632dd73aade' 
  })
  userId!: string;
}