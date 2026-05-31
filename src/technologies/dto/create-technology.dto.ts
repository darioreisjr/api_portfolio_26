import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'NestJS', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/nestjs.svg' })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}
