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
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripExpenseDto } from './dto/create-trip-expense.dto';
import { UpdateTripExpenseDto } from './dto/update-trip-expense.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('trips')
@UseGuards(AuthGuard, RolesGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body(ValidationPipe) createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.remove(id);
  }

  // Trip Expenses Endpoints
  @Post(':tripId/expenses')
  @Roles(Role.ADMIN, Role.STAFF)
  createExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body(ValidationPipe) createTripExpenseDto: CreateTripExpenseDto,
  ) {
    return this.tripsService.createExpense(tripId, createTripExpenseDto);
  }

  @Get(':id/expenses')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  getExpenses(@Param('id', ParseIntPipe) tripId: number) {
    return this.tripsService.getExpenses(tripId);
  }

  @Patch(':tripId/expenses/:expenseId')
  @Roles(Role.ADMIN, Role.STAFF)
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
  @Roles(Role.ADMIN)
  removeExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('expenseId', ParseIntPipe) expenseId: number,
  ) {
    return this.tripsService.removeExpense(tripId, expenseId);
  }
}
