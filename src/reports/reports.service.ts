import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDriverReport(driverId: number) {
    // verify the driver exists
    const driver = await this.databaseService.drivers.findUnique({
      where: { id: driverId },
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    // Get trip statistics
    const trips = await this.databaseService.trips.findMany({
      where: { driver_id: driverId },
      include: {
        client: {
          select: {
            name: true,
          },
        },
        truck: {
          select: {
            number: true,
            model: true,
          },
        },
      },
      orderBy: {
        start_date: 'desc',
      },
    });

    // Calculate metrics
    const totalTrips = trips.length;
    const totalRevenue = trips.reduce(
      (sum, trip) => sum + trip.base_revenue + trip.additional_charges,
      0,
    );
    const averageRevenue = totalTrips > 0 ? totalRevenue / totalTrips : 0;

    // Trip status breakdown
    const statusBreakdown = trips.reduce(
      (acc, trip) => {
        acc[trip.status] = (acc[trip.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      driver: {
        id: driver.id,
        first_name: driver.first_name,
        last_name: driver.last_name,
        license_number: driver.license_number,
        phone: driver.phone,
        is_active: driver.is_active,
        created_at: driver.created_at,
        creator: driver.creator,
      },
      performance_metrics: {
        total_trips: totalTrips,
        total_revenue: totalRevenue,
        average_revenue_per_trip: averageRevenue,
      },
      trip_status_breakdown: statusBreakdown,
    };
  }

  async getTruckReport(truckId: number) {
    // verify the truck exists
    const truck = await this.databaseService.trucks.findUnique({
      where: { id: truckId },
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!truck) {
      throw new NotFoundException(`Truck with ID ${truckId} not found`);
    }

    // Get trip statistics
    const trips = await this.databaseService.trips.findMany({
      where: { truck_id: truckId },
      include: {
        client: {
          select: {
            name: true,
          },
        },
        driver: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        start_date: 'desc',
      },
    });

    const totalTrips = trips.length;
    const totalRevenue = trips.reduce(
      (sum, trip) => sum + trip.base_revenue + trip.additional_charges,
      0,
    );
    const averageRevenue = totalTrips > 0 ? totalRevenue / totalTrips : 0;

    const statusBreakdown = trips.reduce(
      (acc, trip) => {
        acc[trip.status] = (acc[trip.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const completedTrips = trips.filter(
      (trip) => trip.status === 'COMPLETED',
    ).length;

    return {
      truck: {
        id: truck.id,
        number: truck.number,
        model: truck.model,
        fuel_type: truck.fuel_type,
        current_status: truck.current_status,
        is_active: truck.is_active,
        created_at: truck.created_at,
        creator: truck.creator,
      },
      performance_metrics: {
        total_trips: totalTrips,
        completed_trips: completedTrips,
        total_revenue: totalRevenue,
        average_revenue_per_trip: averageRevenue,
      },
      trip_status_breakdown: statusBreakdown,
    };
  }

  async getClientReport(clientId: number) {
    // verify the client exists
    const client = await this.databaseService.clients.findUnique({
      where: { id: clientId },
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Get trip statistics
    const trips = await this.databaseService.trips.findMany({
      where: {
        client_id: clientId,
      },
      include: {
        driver: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        truck: {
          select: {
            number: true,
            model: true,
          },
        },
      },
      orderBy: {
        start_date: 'desc',
      },
    });

    // Calculate metrics
    const totalTrips = trips.length;
    const totalRevenue = trips.reduce(
      (sum, trip) => sum + trip.base_revenue + trip.additional_charges,
      0,
    );
    const averageRevenue = totalTrips > 0 ? totalRevenue / totalTrips : 0;

    // Trip status
    const statusBreakdown = trips.reduce(
      (acc, trip) => {
        acc[trip.status] = (acc[trip.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      client: {
        id: client.id,
        name: client.name,
        contact_person: client.contact_person,
        phone: client.phone,
        email: client.email,
        address: client.address,
        is_active: client.is_active,
        created_at: client.created_at,
        creator: client.creator,
      },
      performance_metrics: {
        total_trips: totalTrips,
        total_revenue: totalRevenue,
        average_revenue_per_trip: averageRevenue,
      },
      trip_status_breakdown: statusBreakdown,
    };
  }

  async getTripFinancialAnalysis(tripId: number) {
    // verify the trip exists and get trip details
    const trip = await this.databaseService.trips.findUnique({
      where: { id: tripId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            contact_person: true,
            email: true,
          },
        },
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            license_number: true,
          },
        },
        truck: {
          select: {
            id: true,
            number: true,
            model: true,
            fuel_type: true,
          },
        },
        creator: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        tripExpenses: {
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            receipt_number: true,
            vendor_name: true,
            expense_date: true,
          },
          orderBy: {
            expense_date: 'desc',
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    // Calculate revenue breakdown
    const baseRevenue = trip.base_revenue;
    const additionalCharges = trip.additional_charges;
    const totalRevenue = baseRevenue + additionalCharges;

    // Calculate total expenses
    const totalExpenses = trip.tripExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    // Calculate profit
    const grossProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Calculate trip duration if end_date exists
    let tripDurationDays: number | null = null;
    if (trip.end_date) {
      const diffTime = Math.abs(
        trip.end_date.getTime() - trip.start_date.getTime(),
      );
      tripDurationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      trip_info: {
        id: trip.id,
        start_date: trip.start_date,
        end_date: trip.end_date,
        duration_days: tripDurationDays,
        status: trip.status,
        origin_address: trip.origin_address,
        destination_address: trip.destination_address,
        created_at: trip.created_at,
        creator: trip.creator,
      },
      associated_entities: {
        client: trip.client,
        driver: trip.driver,
        truck: trip.truck,
      },
      revenue_breakdown: {
        base_revenue: baseRevenue,
        additional_charges: additionalCharges,
        total_revenue: totalRevenue,
      },
      expense_breakdown: {
        total_expenses: totalExpenses,
        expense_count: trip.tripExpenses.length,
      },
      profit_analysis: {
        gross_profit: grossProfit,
        profit_margin_percentage: Math.round(profitMargin * 100) / 100,
        is_profitable: grossProfit > 0,
      },
      summary: {
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        net_profit: grossProfit,
      },
    };
  }
}
