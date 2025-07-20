import { ApiProperty } from '@nestjs/swagger';
import { CreateDriverDto } from './create-driver.dto';

export class DriverResponseDto {
  @ApiProperty({ example: 'Driver created Successfully' })
  message: string;

  @ApiProperty({ type: CreateDriverDto })
  data: CreateDriverDto;
}

export class DriversListResponseDto {
  @ApiProperty({ type: [CreateDriverDto] })
  data: CreateDriverDto[];
}

export class DriverMessageResponseDto {
  @ApiProperty({ example: 'Driver deleted Successfully' })
  message: string;
}
