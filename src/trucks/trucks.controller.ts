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
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';
import { JwtPayload } from '../auth/interface';
import {
  TruckResponseDto,
  TrucksListResponseDto,
  TruckMessageResponseDto,
} from './dto/response.dto';

@ApiTags('Trucks')
@ApiCookieAuth('access_token')
@Controller('trucks')
@UseGuards(AuthGuard, RolesGuard)
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @ApiOperation({ summary: 'Create new truck' })
  @ApiBody({ type: CreateTruckDto })
  @ApiResponse({
    status: 201,
    type: TruckResponseDto,
    description: 'Truck created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot create trucks',
  })
  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(
    @Body(ValidationPipe) createTruckDto: CreateTruckDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.trucksService.create(createTruckDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all trucks' })
  @ApiResponse({
    status: 200,
    type: TrucksListResponseDto,
    description: 'List of trucks retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.trucksService.findAll();
  }

  @ApiOperation({ summary: 'Get truck by ID' })
  @ApiParam({
    name: 'id',
    description: 'Truck ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: TruckResponseDto,
    description: 'Truck retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trucksService.findOne(id);
  }

  @ApiOperation({ summary: 'Update truck' })
  @ApiParam({ name: 'id', description: 'Truck ID', type: 'number', example: 1 })
  @ApiBody({ type: UpdateTruckDto })
  @ApiResponse({
    status: 200,
    type: TruckResponseDto,
    description: 'Truck updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot update trucks',
  })
  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTruckDto: UpdateTruckDto,
  ) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @ApiOperation({ summary: 'Delete truck' })
  @ApiParam({ name: 'id', description: 'Truck ID', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    type: TruckMessageResponseDto,
    description: 'Truck deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN can delete trucks',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trucksService.remove(id);
  }
}
