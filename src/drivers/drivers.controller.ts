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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';
import {
  DriverResponseDto,
  DriversListResponseDto,
  DriverMessageResponseDto,
} from './dto/response.dto';

@ApiTags('Drivers')
@ApiCookieAuth('access_token')
@Controller('drivers')
@UseGuards(AuthGuard, RolesGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @ApiOperation({ summary: 'Create new driver' })
  @ApiBody({ type: CreateDriverDto })
  @ApiResponse({
    status: 201,
    type: DriverResponseDto,
    description: 'Driver created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot create drivers',
  })
  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body(ValidationPipe) createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({
    status: 200,
    type: DriversListResponseDto,
    description: 'List of drivers retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.driversService.findAll();
  }

  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({
    name: 'id',
    description: 'Driver ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: DriverResponseDto,
    description: 'Driver retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.findOne(id);
  }

  @ApiOperation({ summary: 'Update driver' })
  @ApiParam({
    name: 'id',
    description: 'Driver ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateDriverDto })
  @ApiResponse({
    status: 200,
    type: DriverResponseDto,
    description: 'Driver updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot update drivers',
  })
  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDriverDto: UpdateDriverDto,
  ) {
    return this.driversService.update(id, updateDriverDto);
  }

  @ApiOperation({ summary: 'Delete driver' })
  @ApiParam({
    name: 'id',
    description: 'Driver ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: DriverMessageResponseDto,
    description: 'Driver deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN can delete drivers',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driversService.remove(id);
  }
}
