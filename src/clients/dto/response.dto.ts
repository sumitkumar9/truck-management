import { ApiProperty } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto'

export class ClientResponseDto {
  @ApiProperty({ example: 'Client created Successfully' })
  message: string;

  @ApiProperty({ type: CreateClientDto })
  data: CreateClientDto;
}

export class ClientsListResponseDto {
  @ApiProperty({ type: [CreateClientDto] })
  data: CreateClientDto[];
}

export class ClientMessageResponseDto {
  @ApiProperty({ example: 'Client deleted Successfully' })
  message: string;
}
