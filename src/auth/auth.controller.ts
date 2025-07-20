import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in-dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // Clear the access token cookie
    res.clearCookie('access_token');
    return res.json({
      message: 'Logged out successfully',
    });
  }
}
