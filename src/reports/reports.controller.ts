import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from 'generated/prisma';

@Controller('reports')
@UseGuards(AuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('driver/:id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  getDriverReport(@Param('id', ParseIntPipe) driverId: number) {
    return this.reportsService.getDriverReport(driverId);
  }

  @Get('truck/:id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  getTruckReport(@Param('id', ParseIntPipe) truckId: number) {
    return this.reportsService.getTruckReport(truckId);
  }

  @Get('client/:id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  getClientReport(@Param('id', ParseIntPipe) clientId: number) {
    return this.reportsService.getClientReport(clientId);
  }

  @Get('trip/:id')
  @Roles(Role.ADMIN, Role.STAFF, Role.VIEWER)
  getTripFinancialAnalysis(@Param('id', ParseIntPipe) tripId: number) {
    return this.reportsService.getTripFinancialAnalysis(tripId);
  }
}
