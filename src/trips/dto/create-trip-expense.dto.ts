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
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expense_Type } from 'generated/prisma';

export class CreateTripExpenseDto {
  @ApiProperty({
    description: 'Type of expense',
    enum: Expense_Type,
    example: Expense_Type.FUEL,
  })
  @IsEnum(Expense_Type)
  @IsNotEmpty()
  type: Expense_Type;

  @ApiProperty({
    description: 'Expense amount',
    example: 250.75,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Description of the expense',
    example: 'Fuel refill at Highway Gas Station',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description: 'Receipt number (optional)',
    example: 'RCP-2024-001',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  receipt_number?: string;

  @ApiProperty({
    description: 'Vendor/supplier name (optional)',
    example: 'Highway Gas Station',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  vendor_name?: string;

  @ApiProperty({
    description: 'Date when the expense occurred',
    example: '2024-01-15T14:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  expense_date: Date;
}
