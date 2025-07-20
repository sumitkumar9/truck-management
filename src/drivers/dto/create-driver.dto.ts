/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({
    description: 'Driver first name',
    example: 'John',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  first_name: string;

  @ApiProperty({
    description: 'Driver last name',
    example: 'Smith',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  last_name: string;

  @ApiProperty({
    description: 'Driver license number (unique)',
    example: 'DL123456789',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  license_number: string;

  @ApiProperty({
    description: 'Driver contact phone number',
    example: '+1234567890',
    pattern: '^[\\+]?[1-9][\\d]{0,15}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'Phone number must be a valid format',
  })
  phone: string;

  @ApiProperty({
    description: 'Whether the driver is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @ApiProperty({
    description: 'ID of the user creating this driver',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
