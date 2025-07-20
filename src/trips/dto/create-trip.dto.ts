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
import { ApiProperty } from '@nestjs/swagger';
import { Trip_Status } from 'generated/prisma';

export class CreateTripDto {
  @ApiProperty({
    description: 'ID of the client for this trip',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  client_id: number;

  @ApiProperty({
    description: 'ID of the assigned driver (optional)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  driver_id: number;

  @ApiProperty({
    description: 'ID of the assigned truck (optional)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  truck_id: number;

  @ApiProperty({
    description: 'Trip start date and time',
    example: '2024-01-15T08:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({
    description: 'Trip end date and time (optional)',
    example: '2024-01-15T18:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @ApiProperty({
    description: 'Trip origin/pickup address',
    example: '123 Warehouse St, City A, State 12345',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  origin_address: string;

  @ApiProperty({
    description: 'Trip destination/delivery address',
    example: '456 Delivery Ave, City B, State 67890',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  destination_address: string;

  @ApiProperty({
    description: 'Base revenue amount for the trip',
    example: 1500.00,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  base_revenue: number;

  @ApiProperty({
    description: 'Additional charges for the trip',
    example: 150.00,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  additional_charges?: number = 0;

  @ApiProperty({
    description: 'Current status of the trip',
    enum: Trip_Status,
    example: Trip_Status.SCHEDULED,
  })
  @IsEnum(Trip_Status)
  @IsNotEmpty()
  status: Trip_Status;

  @ApiProperty({
    description: 'ID of the user creating this trip',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  created_by: number;
}
