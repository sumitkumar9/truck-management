import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('driver/:id')
  getDriverReport(@Param('id', ParseIntPipe) driverId: number) {
    return this.reportsService.getDriverReport(driverId);
  }

  @Get('truck/:id')
  getTruckReport(@Param('id', ParseIntPipe) truckId: number) {
    return this.reportsService.getTruckReport(truckId);
  }

  @Get('client/:id')
  getClientReport(@Param('id', ParseIntPipe) clientId: number) {
    return this.reportsService.getClientReport(clientId);
  }

  @Get('trip/:id')
  getTripFinancialAnalysis(@Param('id', ParseIntPipe) tripId: number) {
    return this.reportsService.getTripFinancialAnalysis(tripId);
  }
}
