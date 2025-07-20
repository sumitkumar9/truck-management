import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ClientsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const client = await this.databaseService.clients.create({
        data: createClientDto,
      });
      return {
        message: 'Client created Successfully',
        data: client,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Client with this email already exists');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Invalid created_by user ID');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.databaseService.clients.findMany({
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
    const client = await this.databaseService.clients.findUnique({
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

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.databaseService.clients.update({
        where: { id },
        data: updateClientDto,
      });
      return {
        message: 'Client updated Successfully',
        data: client,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Client with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Client with this email already exists');
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.databaseService.clients.delete({
        where: { id },
      });
      return {
        message: 'Client deleted Successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Client with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
