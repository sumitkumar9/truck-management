import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserResponseDto {
  @ApiProperty({ example: 'User updated Successfully' })
  message: string;

  @ApiProperty({ type: CreateUserDto })
  data: CreateUserDto;
}

export class UsersListResponseDto {
  @ApiProperty({ type: [CreateUserDto] })
  data: CreateUserDto[];
}

export class MessageResponseDto {
  @ApiProperty({ example: 'User deleted Successfully' })
  message: string;
}
