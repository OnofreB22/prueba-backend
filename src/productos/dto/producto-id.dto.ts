import { IsUUID } from 'class-validator';

export class ProductoIdDto {
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  id: string;
}
