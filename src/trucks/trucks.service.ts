import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class TrucksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTruckDto: CreateTruckDto, userId: number) {
    try {
      const truck = await this.databaseService.trucks.create({
        data: {
          ...createTruckDto,
          created_by: userId,
        },
      });
      return {
        message: 'Truck created Successfully',
        data: truck,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Truck with this number already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid user ID');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.databaseService.trucks.findMany({
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
    const truck = await this.databaseService.trucks.findUnique({
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

    if (!truck) {
      throw new NotFoundException(`Truck with ID ${id} not found`);
    }

    return truck;
  }

  async update(id: number, updateTruckDto: UpdateTruckDto) {
    try {
      const truck = await this.databaseService.trucks.update({
        where: { id },
        data: updateTruckDto,
      });
      return {
        message: 'Truck updated Successfully',
        data: truck,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Truck with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Truck with this number already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.databaseService.trucks.delete({
        where: { id },
      });
      return {
        message: 'Truck deleted Successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Truck with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
