import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class DriversService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createDriverDto: CreateDriverDto, userId: number) {
    try {
      const driver = await this.databaseService.drivers.create({
        data: {
          ...createDriverDto,
          created_by: userId,
        },
      });
      return {
        message: 'Driver created Successfully',
        data: driver,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Driver with this license number already exists',
          );
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid user ID');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.databaseService.drivers.findMany({
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const driver = await this.databaseService.drivers.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            is_active: true,
          },
        },
        trips: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
            status: true,
            origin_address: true,
            destination_address: true,
          },
          take: 10, // Limit to recent 10 trips
        },
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  async update(id: number, updateDriverDto: UpdateDriverDto) {
    try {
      const driver = await this.databaseService.drivers.update({
        where: { id },
        data: updateDriverDto,
      });
      return {
        message: 'Driver updated Successfully',
        data: driver,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Driver with this license number already exists',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.databaseService.drivers.delete({
        where: { id },
      });
      return { message: 'Driver Deleted Succesfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Driver with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new ConflictException('Cannot delete driver with active trips');
        }
      }
      throw error;
    }
  }
}
