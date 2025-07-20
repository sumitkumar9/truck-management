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

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  contact_person: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'Phone number must be a valid format',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  address: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
