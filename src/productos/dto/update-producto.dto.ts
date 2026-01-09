import { PartialType } from '@nestjs/mapped-types';
import { 
  IsString, 
  IsNumber, 
  IsPositive, 
  Min, 
  MaxLength,
  MinLength,
  IsInt,
  Max,
  IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  nombre?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  @Max(99999999.99, { message: 'El precio no puede exceder 99,999,999.99' })
  @Transform(({ value }) => parseFloat(value))
  precio?: number;

  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Max(999999, { message: 'El stock no puede exceder 999,999 unidades' })
  @Transform(({ value }) => parseInt(value))
  stock?: number;
}
