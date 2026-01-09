import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoIdDto } from './dto/producto-id.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: ProductoIdDto) {
    return this.productosService.findOne(params.id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, skipMissingProperties: true }))
  update(
    @Param() params: ProductoIdDto,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(params.id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: ProductoIdDto) {
    return this.productosService.remove(params.id);
  }
}

