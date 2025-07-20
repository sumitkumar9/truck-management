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
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  last_name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'securepassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    example: Role.VIEWER,
    default: Role.VIEWER,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.VIEWER;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
