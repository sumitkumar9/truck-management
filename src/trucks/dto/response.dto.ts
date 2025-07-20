import { ApiProperty } from '@nestjs/swagger';
import { CreateTruckDto } from './create-truck.dto';

export class TruckResponseDto {
  @ApiProperty({ example: 'Truck created Successfully' })
  message: string;

  @ApiProperty({ type: CreateTruckDto })
  data: CreateTruckDto;
}

export class TrucksListResponseDto {
  @ApiProperty({ type: [CreateTruckDto] })
  data: CreateTruckDto[];
}

export class TruckMessageResponseDto {
  @ApiProperty({ example: 'Truck deleted Successfully' })
  message: string;
}
