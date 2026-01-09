import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsPositive, 
  Min, 
  MaxLength,
  MinLength,
  IsInt,
  Max
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  nombre: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con máximo 2 decimales' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  @Max(99999999.99, { message: 'El precio no puede exceder 99,999,999.99' })
  @Transform(({ value }) => parseFloat(value))
  precio: number;

  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Max(999999, { message: 'El stock no puede exceder 999,999 unidades' })
  @Transform(({ value }) => parseInt(value))
  stock: number;
}
