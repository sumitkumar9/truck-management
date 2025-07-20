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

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  license_number: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: 'Phone number must be a valid format',
  })
  phone: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
