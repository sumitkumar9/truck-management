/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Fuel_Type, Status } from 'generated/prisma';

export class CreateTruckDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  number: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  model: string;

  @IsEnum(Fuel_Type)
  @IsOptional()
  fuel_type?: Fuel_Type = Fuel_Type.DIESEL;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsEnum(Status)
  @IsOptional()
  current_status?: Status = Status.AVAILABLE;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
