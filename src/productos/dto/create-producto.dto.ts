import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precio: number;

  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;
}
