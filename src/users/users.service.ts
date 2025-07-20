import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.databaseService.users.create({
        data: createUserDto,
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.databaseService.users.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.databaseService.users.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        createdTrips: {
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
        createdDrivers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            license_number: true,
            is_active: true,
          },
          take: 10, // Limit to recent 10 drivers
        },
        createdTrucks: {
          select: {
            id: true,
            number: true,
            model: true,
            current_status: true,
            is_active: true,
          },
          take: 10, // Limit to recent 10 trucks
        },
        createdClients: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            email: true,
            is_active: true,
          },
          take: 10, // Limit to recent 10 clients
        },
        _count: {
          select: {
            createdTrips: true,
            createdDrivers: true,
            createdTrucks: true,
            createdClients: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.databaseService.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        role: true,
        is_active: true,
      },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.databaseService.users.update({
        where: { id },
        data: updateUserDto,
      });
      return {
        message: 'User Updated Successfully',
        data: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('User with this email already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.databaseService.users.delete({
        where: { id },
      });
      return { message: 'User Deleted Successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new ConflictException(
            'Cannot delete user with associated records',
          );
        }
      }
      throw error;
    }
  }
}
