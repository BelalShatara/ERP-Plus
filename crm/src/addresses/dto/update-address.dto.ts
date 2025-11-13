import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiPropertyOptional({ description: 'Address ID' })
  @IsOptional()
  @IsNumber()
  id?: number;
}
