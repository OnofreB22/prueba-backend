import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;

  // Mock de datos de prueba
  const mockProducto: Producto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nombre: 'Laptop HP',
    precio: 1500.50,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductoArray: Producto[] = [
    mockProducto,
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      nombre: 'Mouse Logitech',
      precio: 25.99,
      stock: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Mock del repositorio
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un producto exitosamente', async () => {
      const createDto: CreateProductoDto = {
        nombre: 'Laptop HP',
        precio: 1500.50,
        stock: 10,
      };

      mockRepository.create.mockReturnValue(mockProducto);
      mockRepository.save.mockResolvedValue(mockProducto);

      const result = await service.create(createDto);

      expect(result).toEqual(mockProducto);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProducto);
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de productos', async () => {
      mockRepository.find.mockResolvedValue(mockProductoArray);

      const result = await service.findAll();

      expect(result).toEqual(mockProductoArray);
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('debería retornar un array vacío cuando no hay productos', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('debería retornar un producto por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducto);

      const result = await service.findOne(mockProducto.id);

      expect(result).toEqual(mockProducto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducto.id },
      });
    });

    it('debería lanzar NotFoundException si el producto no existe', async () => {
      const id = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow(
        `Producto con ID ${id} no encontrado`,
      );
    });
  });

  describe('update', () => {
    it('debería actualizar un producto exitosamente', async () => {
      const updateDto: UpdateProductoDto = {
        precio: 1400.00,
        stock: 8,
      };

      const productoActualizado = {
        ...mockProducto,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.save.mockResolvedValue(productoActualizado);

      const result = await service.update(mockProducto.id, updateDto);

      expect(result).toEqual(productoActualizado);
      expect(result.precio).toBe(1400.00);
      expect(result.stock).toBe(8);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el producto no existe', async () => {
      const id = 'non-existent-id';
      const updateDto: UpdateProductoDto = { precio: 100 };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto exitosamente', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.remove.mockResolvedValue(mockProducto);

      await service.remove(mockProducto.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProducto.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProducto);
    });

    it('debería lanzar NotFoundException si el producto no existe', async () => {
      const id = 'non-existent-id';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
