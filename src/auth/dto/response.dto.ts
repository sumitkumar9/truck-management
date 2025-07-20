import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';
import { SignInDto } from './sign-in-dto';

export class LoginResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ type: SignInDto })
  user: SignInDto;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'User registered successfully' })
  message: string;

  @ApiProperty({ type: RegisterDto })
  data: RegisterDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}
