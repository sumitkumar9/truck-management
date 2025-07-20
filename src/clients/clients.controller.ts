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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';
import {
  ClientResponseDto,
  ClientsListResponseDto,
  MessageResponseDto,
} from './dto/response.dto';

@ApiTags('Clients')
@ApiCookieAuth('access_token')
@Controller('clients')
@UseGuards(AuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create new client' })
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({
    status: 201,
    type: ClientResponseDto,
    description: 'Client created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot create clients',
  })
  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body(ValidationPipe) createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({
    status: 200,
    type: ClientsListResponseDto,
    description: 'List of clients retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findAll() {
    return this.clientsService.findAll();
  }

  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: ClientResponseDto,
    description: 'Client retrieved successfully',
  })
  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update client' })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({
    status: 200,
    type: ClientResponseDto,
    description: 'Client updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - VIEWER role cannot update clients',
  })
  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @ApiOperation({ summary: 'Delete client' })
  @ApiParam({
    name: 'id',
    description: 'Client ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    type: MessageResponseDto,
    description: 'Client deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN can delete clients',
  })
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(id);
  }
}
