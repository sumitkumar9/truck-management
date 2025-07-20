import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripExpenseDto } from './dto/create-trip-expense.dto';
import { UpdateTripExpenseDto } from './dto/update-trip-expense.dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body(ValidationPipe) createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.remove(id);
  }

  // Trip Expenses Endpoints
  @Post(':tripId/expenses')
  createExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body(ValidationPipe) createTripExpenseDto: CreateTripExpenseDto,
  ) {
    return this.tripsService.createExpense(tripId, createTripExpenseDto);
  }

  @Get(':id/expenses')
  getExpenses(@Param('id', ParseIntPipe) tripId: number) {
    return this.tripsService.getExpenses(tripId);
  }

  @Patch(':tripId/expenses/:expenseId')
  updateExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('expenseId', ParseIntPipe) expenseId: number,
    @Body(ValidationPipe) updateTripExpenseDto: UpdateTripExpenseDto,
  ) {
    return this.tripsService.updateExpense(
      tripId,
      expenseId,
      updateTripExpenseDto,
    );
  }

  @Delete(':tripId/expenses/:expenseId')
  removeExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('expenseId', ParseIntPipe) expenseId: number,
  ) {
    return this.tripsService.removeExpense(tripId, expenseId);
  }
}
