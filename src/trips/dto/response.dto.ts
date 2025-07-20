import { ApiProperty } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';
import { CreateTripExpenseDto } from './create-trip-expense.dto';

export class TripResponseDto {
  @ApiProperty({ example: 'Trip created Successfully' })
  message: string;

  @ApiProperty({ type: CreateTripDto })
  data: CreateTripDto;
}

export class TripsListResponseDto {
  @ApiProperty({ type: [CreateTripDto] })
  data: CreateTripDto[];
}

export class TripExpenseResponseDto {
  @ApiProperty({ example: 'Trip expense created Successfully' })
  message: string;

  @ApiProperty({ type: CreateTripExpenseDto })
  data: CreateTripExpenseDto;
}

export class TripExpensesListResponseDto {
  @ApiProperty({ type: [CreateTripExpenseDto] })
  data: CreateTripExpenseDto[];
}

export class TripMessageResponseDto {
  @ApiProperty({ example: 'Trip deleted Successfully' })
  message: string;
}
