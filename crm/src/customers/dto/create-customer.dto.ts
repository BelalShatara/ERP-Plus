import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer name', example: 'Acme Corporation' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Customer type',
    example: 'Company',
    enum: ['Individual', 'Company'],
  })
  @IsOptional()
  @IsString()
  customerType?: string;

  @ApiPropertyOptional({
    description: 'Customer email',
    example: 'contact@acme.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Customer phone',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Tax ID', example: 'TAX123456' })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://acme.com',
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Is customer active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
