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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripExpenseDto } from './dto/create-trip-expense.dto';
import { UpdateTripExpenseDto } from './dto/update-trip-expense.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';
import { JwtPayload } from '../auth/interface';
import {
  TripResponseDto,
  TripsListResponseDto,
  TripExpenseResponseDto,
  TripExpensesListResponseDto,
  TripMessageResponseDto,
} from './dto/response.dto';

@ApiTags('Trips')
@ApiCookieAuth('access_token')
@Controller('trips')
@UseGuards(AuthGuard, RolesGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @ApiOperation({ summary: 'Create new trip' })
  @ApiBody({ type: CreateTripDto })
  @ApiResponse({
    status: 201,
    type: TripResponseDto,
    description: 'Trip created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot create trips',
  })
  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(
    @Body(ValidationPipe) createTripDto: CreateTripDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.tripsService.create(createTripDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all trips' })
  @ApiResponse({
    status: 200,
    type: TripsListResponseDto,
    description: 'List of trips retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.tripsService.findAll();
  }

  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiParam({
    name: 'id',
    description: 'Trip ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: TripResponseDto,
    description: 'Trip retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update trip' })
  @ApiParam({ name: 'id', description: 'Trip ID', type: 'number', example: 1 })
  @ApiBody({ type: UpdateTripDto })
  @ApiResponse({
    status: 200,
    type: TripResponseDto,
    description: 'Trip updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot update trips',
  })
  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, updateTripDto);
  }

  @ApiOperation({ summary: 'Delete trip' })
  @ApiParam({ name: 'id', description: 'Trip ID', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    type: TripMessageResponseDto,
    description: 'Trip deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN can delete trips',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.remove(id);
  }

  // Trip Expenses Endpoints
  @ApiOperation({ summary: 'Create trip expense', tags: ['Trip Expenses'] })
  @ApiParam({
    name: 'tripId',
    description: 'Trip ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: CreateTripExpenseDto })
  @ApiResponse({
    status: 201,
    type: TripExpenseResponseDto,
    description: 'Trip expense created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot create expenses',
  })
  @Post(':tripId/expenses')
  @Roles(Role.ADMIN, Role.STAFF)
  createExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body(ValidationPipe) createTripExpenseDto: CreateTripExpenseDto,
  ) {
    return this.tripsService.createExpense(tripId, createTripExpenseDto);
  }

  @ApiOperation({ summary: 'Get trip expenses', tags: ['Trip Expenses'] })
  @ApiParam({
    name: 'id',
    description: 'Trip ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: TripExpensesListResponseDto,
    description: 'Trip expenses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id/expenses')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  getExpenses(@Param('id', ParseIntPipe) tripId: number) {
    return this.tripsService.getExpenses(tripId);
  }

  @ApiOperation({ summary: 'Update trip expense', tags: ['Trip Expenses'] })
  @ApiParam({
    name: 'tripId',
    description: 'Trip ID',
    type: 'number',
    example: 1,
  })
  @ApiParam({
    name: 'expenseId',
    description: 'Expense ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateTripExpenseDto })
  @ApiResponse({
    status: 200,
    type: TripExpenseResponseDto,
    description: 'Trip expense updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot update expenses',
  })
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

  @ApiOperation({ summary: 'Delete trip expense', tags: ['Trip Expenses'] })
  @ApiParam({
    name: 'tripId',
    description: 'Trip ID',
    type: 'number',
    example: 1,
  })
  @ApiParam({
    name: 'expenseId',
    description: 'Expense ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: TripMessageResponseDto,
    description: 'Trip expense deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN can delete expenses',
  })
  @Delete(':tripId/expenses/:expenseId')
  @Roles(Role.ADMIN)
  removeExpense(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('expenseId', ParseIntPipe) expenseId: number,
  ) {
    return this.tripsService.removeExpense(tripId, expenseId);
  }
}
