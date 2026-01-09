import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(createProductoDto);
    return await this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return await this.productosRepository.find();
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productosRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return await this.productosRepository.save(producto);
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepository.remove(producto);
  }
}
