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
import { Expense_Type } from 'generated/prisma';

export class CreateTripExpenseDto {
  @IsEnum(Expense_Type)
  @IsNotEmpty()
  type: Expense_Type;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  receipt_number?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  vendor_name?: string;

  @IsDateString()
  @IsNotEmpty()
  expense_date: Date;
}
