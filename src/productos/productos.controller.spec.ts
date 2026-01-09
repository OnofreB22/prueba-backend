import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockProducto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    nombre: 'Laptop HP',
    precio: 1500.50,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un producto', async () => {
      const createDto = {
        nombre: 'Laptop HP',
        precio: 1500.50,
        stock: 10,
      };

      mockRepository.create.mockReturnValue(mockProducto);
      mockRepository.save.mockResolvedValue(mockProducto);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockProducto);
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de productos', async () => {
      mockRepository.find.mockResolvedValue([mockProducto]);

      const result = await controller.findAll();

      expect(result).toEqual([mockProducto]);
    });
  });

  describe('findOne', () => {
    it('debería retornar un producto por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducto);

      const result = await controller.findOne({ id: mockProducto.id });

      expect(result).toEqual(mockProducto);
    });
  });

  describe('update', () => {
    it('debería actualizar un producto', async () => {
      const updateDto = { precio: 1400.00 };
      const productoActualizado = { ...mockProducto, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.save.mockResolvedValue(productoActualizado);

      const result = await controller.update(
        { id: mockProducto.id },
        updateDto,
      );

      expect(result.precio).toBe(1400.00);
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto', async () => {
      mockRepository.findOne.mockResolvedValue(mockProducto);
      mockRepository.remove.mockResolvedValue(mockProducto);

      await controller.remove({ id: mockProducto.id });

      expect(mockRepository.remove).toHaveBeenCalledWith(mockProducto);
    });
  });
});
