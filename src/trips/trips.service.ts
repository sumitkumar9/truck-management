import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripExpenseDto } from './dto/create-trip-expense.dto';
import { UpdateTripExpenseDto } from './dto/update-trip-expense.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class TripsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTripDto: CreateTripDto) {
    try {
      const trip = await this.databaseService.trips.create({
        data: {
          ...createTripDto,
          start_date: new Date(createTripDto.start_date),
          end_date: createTripDto.end_date
            ? new Date(createTripDto.end_date)
            : null,
        },
      });
      return {
        message: 'Trip created Successfully',
        data: trip,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Invalid client_id, driver_id, truck_id, or created_by user ID',
          );
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.databaseService.trips.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            contact_person: true,
          },
        },
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            license_number: true,
          },
        },
        truck: {
          select: {
            id: true,
            number: true,
            model: true,
            current_status: true,
          },
        },
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        _count: {
          select: {
            tripExpenses: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const trip = await this.databaseService.trips.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            license_number: true,
            phone: true,
            is_active: true,
          },
        },
        truck: {
          select: {
            id: true,
            number: true,
            model: true,
            fuel_type: true,
            current_status: true,
            is_active: true,
          },
        },
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            is_active: true,
          },
        },
        tripExpenses: {
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            expense_date: true,
          },
          orderBy: {
            expense_date: 'desc',
          },
        },
        _count: {
          select: {
            tripExpenses: true,
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return trip;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    try {
      const updateData = { ...updateTripDto };

      if (updateTripDto.start_date) {
        updateData.start_date = new Date(updateTripDto.start_date);
      }
      if (updateTripDto.end_date) {
        updateData.end_date = new Date(updateTripDto.end_date);
      }

      const trip = await this.databaseService.trips.update({
        where: { id },
        data: updateData,
      });
      return {
        message: 'Trip updated Successfully',
        data: trip,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Trip with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            'Invalid client_id, driver_id, truck_id, or created_by user ID',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.databaseService.trips.delete({
        where: { id },
      });
      return {
        message: 'Trip deleted Successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Trip with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  // Trip Expenses APIs
  async createExpense(
    tripId: number,
    createTripExpenseDto: CreateTripExpenseDto,
  ) {
    try {

      const trip = await this.databaseService.trips.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException(`Trip with ID ${tripId} not found`);
      }

      const expense = await this.databaseService.tripExpenses.create({
        data: {
          trip_id: tripId,
          ...createTripExpenseDto,
          expense_date: new Date(createTripExpenseDto.expense_date),
        },
      });
      return {
        message: 'Trip expense created Successfully',
        data: expense,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid trip ID');
        }
      }
      throw error;
    }
  }

  async getExpenses(tripId: number) {

    const trip = await this.databaseService.trips.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    return this.databaseService.tripExpenses.findMany({
      where: { trip_id: tripId },
      orderBy: {
        expense_date: 'desc',
      },
    });
  }

  async updateExpense(
    tripId: number,
    expenseId: number,
    updateTripExpenseDto: UpdateTripExpenseDto,
  ) {
    try {

      const trip = await this.databaseService.trips.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException(`Trip with ID ${tripId} not found`);
      }

      const updateData = { ...updateTripExpenseDto };

      if (updateTripExpenseDto.expense_date) {
        updateData.expense_date = new Date(updateTripExpenseDto.expense_date);
      }

      const expense = await this.databaseService.tripExpenses.update({
        where: {
          id: expenseId,
          trip_id: tripId,
        },
        data: updateData,
      });

      return {
        message: 'Trip expense updated Successfully',
        data: expense,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Trip expense with ID ${expenseId} not found for trip ${tripId}`,
          );
        }
      }
      throw error;
    }
  }

  async removeExpense(tripId: number, expenseId: number) {
    try {

      const trip = await this.databaseService.trips.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException(`Trip with ID ${tripId} not found`);
      }

      await this.databaseService.tripExpenses.delete({
        where: {
          id: expenseId,
          trip_id: tripId,
        },
      });
      return {
        message: 'Trip expense deleted Successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Trip expense with ID ${expenseId} not found for trip ${tripId}`,
          );
        }
      }
      throw error;
    }
  }
}
