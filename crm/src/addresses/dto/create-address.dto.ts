import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Customer ID', example: 1 })
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'Address type',
    example: 'Billing',
    enum: ['Billing', 'Shipping', 'Office', 'Warehouse', 'Other'],
  })
  @IsEnum(['Billing', 'Shipping', 'Office', 'Warehouse', 'Other'])
  addressType: string;

  @ApiPropertyOptional({
    description: 'Address line 1',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({
    description: 'Address line 2',
    example: 'Suite 100',
  })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City', example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province', example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '10001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Is default address',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
