import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ 
    description: 'Unique user identifier', 
    example: 'f39dc021-6159-492b-bfb0-d632dd73aade' 
  })
  userId!: string;

  @ApiProperty({ 
    description: 'Email address associated with the account', 
    example: 'user@example.com' 
  })
  email!: string;
  
  @ApiProperty({ 
    description: 'Profile creation date', 
    example: '2026-05-27T06:00:00Z',
    required: false 
  })
  createdAt?: string;
}
