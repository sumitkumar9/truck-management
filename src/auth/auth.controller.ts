import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  LogoutResponseDto,
} from './dto/response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
    description: 'Login successful, JWT token set in cookie',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.login(
      signInDto.email,
      signInDto.password,
    );

    res.cookie('access_token', result.access_token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    });

    return res.json({
      message: result.message,
      user: result.data || null,
    });
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    type: RegisterResponseDto,
    description: 'User registered successfully',
  })
  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    type: LogoutResponseDto,
    description: 'Logout successful, authentication cookie cleared',
  })
  @Post('logout')
  logout(@Res() res: Response) {
    // Clear the access token cookie
    res.clearCookie('access_token');
    return res.json({
      message: 'Logged out successfully',
    });
  }
}
