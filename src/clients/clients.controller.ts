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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('clients')
@UseGuards(AuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body(ValidationPipe) createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(id);
  }
}
