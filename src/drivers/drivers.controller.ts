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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('drivers')
@UseGuards(AuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body(ValidationPipe) createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDriverDto: UpdateDriverDto,
  ) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.remove(id);
  }
}
