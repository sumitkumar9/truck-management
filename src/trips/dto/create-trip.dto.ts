/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Trip_Status } from 'generated/prisma';

export class CreateTripDto {
  @IsNumber()
  @IsNotEmpty()
  client_id: number;

  @IsNumber()
  @IsOptional()
  driver_id: number;

  @IsNumber()
  @IsOptional()
  truck_id: number;

  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  origin_address: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  destination_address: string;

  @IsNumber()
  @IsPositive()
  base_revenue: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  additional_charges?: number = 0;

  @IsEnum(Trip_Status)
  @IsNotEmpty()
  status: Trip_Status;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
