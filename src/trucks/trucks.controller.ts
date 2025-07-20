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
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('trucks')
@UseGuards(AuthGuard, RolesGuard)
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body(ValidationPipe) createTruckDto: CreateTruckDto) {
    return this.trucksService.create(createTruckDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.trucksService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trucksService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTruckDto: UpdateTruckDto,
  ) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trucksService.remove(id);
  }
}
