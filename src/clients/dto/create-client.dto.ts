/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client company name',
    example: 'ABC Logistics Inc.',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Primary contact person name',
    example: 'Jane Smith',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  contact_person: string;

  @ApiProperty({
    description: 'Contact phone number',
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
    description: 'Client email address',
    example: 'contact@abclogistics.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Client business address',
    example: '123 Business St, City, State 12345',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  address: string;

  @ApiProperty({
    description: 'Whether the client is active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
