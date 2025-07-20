/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Role } from 'generated/prisma';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.VIEWER;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
