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
import { ApiProperty } from '@nestjs/swagger';
import { Fuel_Type, Status } from 'generated/prisma';

export class CreateTruckDto {
  @ApiProperty({
    description: 'Truck identification number (unique)',
    example: 'TRK001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  number: string;

  @ApiProperty({
    description: 'Truck model/make information',
    example: 'Volvo FH16',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  model: string;

  @ApiProperty({
    description: 'Type of fuel used by the truck',
    enum: Fuel_Type,
    example: Fuel_Type.DIESEL,
    default: Fuel_Type.DIESEL,
    required: false,
  })
  @IsEnum(Fuel_Type)
  @IsOptional()
  fuel_type?: Fuel_Type = Fuel_Type.DIESEL;

  @ApiProperty({
    description: 'Whether the truck is active in the fleet',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @ApiProperty({
    description: 'Current operational status of the truck',
    enum: Status,
    example: Status.AVAILABLE,
    default: Status.AVAILABLE,
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  current_status?: Status = Status.AVAILABLE;
}
