#  Prueba Técnica – API de Productos (NestJS + PostgreSQL)

API REST para gestión de **productos** desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**.

***

##  Descripción del Proyecto

Este proyecto implementa un servicio backend que expone una API REST para la administración de una entidad `Productos`, incluyendo operaciones completas de **CRUD**:

- Crear producto
- Listar productos
- Obtener detalle de un producto
- Actualizar producto
- Eliminar producto

La aplicación está construida con **NestJS** y se conecta a una base de datos **PostgreSQL** utilizando **TypeORM** como ORM. Se aplican **validaciones con DTOs**, manejo de errores y buenas prácticas de estructuración en módulos.

***

## Stack Tecnológico

- **Lenguaje**: Node.js / TypeScript
- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker + Docker Compose
- **Validaciones**: class-validator / class-transformer
- **Configuración**: Variables de entorno (`.env`)

***

## Arquitectura y Diseño

La estructura principal del proyecto es:

```bash
src/
├── app.module.ts
├── main.ts
└── productos/
    ├── dto/
    │   ├── create-producto.dto.ts
    │   ├── update-producto.dto.ts
    │   └── producto-id.dto.ts
    ├── entities/
    │   └── producto.entity.ts
    ├── productos.controller.ts
    ├── productos.module.ts
    └── productos.service.ts
```


### Entidad `Producto`

La entidad `Producto` se mapea a la tabla `productos` en PostgreSQL con los siguientes campos:

- `id`: UUID, PK, generado automáticamente
- `nombre`: string, longitud máxima 255
- `precio`: decimal (precision 10, scale 2)
- `stock`: entero (int)
- `createdAt`: timestamp, se asigna automáticamente
- `updatedAt`: timestamp, se actualiza automáticamente en cada modificación


### Módulos y Capas

- **Controller (`productos.controller.ts`)**
Expone los endpoints REST y recibe/retorna DTOs.
- **Service (`productos.service.ts`)**
Contiene la lógica de negocio, interacción con el repositorio TypeORM y manejo de errores de dominio.
- **Entity (`producto.entity.ts`)**
Mapea la estructura de la tabla en la base de datos.
- **DTOs (`dto/*.ts`)**
Definen la forma y validaciones de datos de entrada (body, params).

***

##  Requerimientos

Antes de ejecutar el proyecto, necesitas:

- Node.js (versión LTS recomendada)
- npm
- Docker y Docker Compose


***

## Puesta en Marcha

### 1. Clonar el Repositorio

```bash
git clone https://github.com/oabenjumev/productos-api.git
cd productos-api
```


### 2. Instalar Dependencias

```bash
npm install
```


### 3. Configurar Variables de Entorno

El proyecto incluye un archivo de ejemplo `.env.example`. Para comenzar:

```bash
cp .env.example .env
```

Variables disponibles:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres123
DB_NAME=productos_db
DB_SYNC=true
```

> Nota: `DB_SYNC=true` facilita el desarrollo al sincronizar el esquema automáticamente. En producción se recomienda `false`.

### 4. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
```

Esto crea un contenedor llamado `productos-db` con PostgreSQL y la base de datos configurada según las variables definidas.

### 5. Ejecutar la Aplicación

```bash
npm run start:dev
```

La API estará disponible en:

```text
http://localhost:3000
```


***

## Endpoints Disponibles

La API expone los siguientes endpoints para la entidad `Productos` bajo el prefijo `/productos`.

### Estructura de la Entidad

```json
{
  "id": "uuid",
  "nombre": "string",
  "precio": 123.45,
  "stock": 10,
  "createdAt": "2026-01-08T21:31:00.000Z",
  "updatedAt": "2026-01-08T21:31:00.000Z"
}
```


### Crear Producto

**POST** `/productos`

**Body (JSON):**

```json
{
  "nombre": "Laptop HP",
  "precio": 1500.50,
  "stock": 10
}
```

**Respuestas:**

- `201 Created`: Producto creado correctamente
- `400 Bad Request`: Error de validación en los datos de entrada

***

### Listar Productos

**GET** `/productos`

**Respuestas:**

- `200 OK`: Lista de productos (puede estar vacía)

***

### Obtener Producto por ID

**GET** `/productos/:id`

Parámetros:

- `id`: UUID del producto

**Respuestas:**

- `200 OK`: Producto encontrado
- `400 Bad Request`: ID no es un UUID válido
- `404 Not Found`: No existe un producto con ese ID

***

### Actualizar Producto

**PATCH** `/productos/:id`

**Body (JSON, todos los campos opcionales):**

```json
{
  "nombre": "Nuevo nombre",
  "precio": 1200.00,
  "stock": 5
}
```

**Respuestas:**

- `200 OK`: Producto actualizado
- `400 Bad Request`: Error de validación o ID inválido
- `404 Not Found`: Producto no encontrado

***

### Eliminar Producto

**DELETE** `/productos/:id`

**Respuestas:**

- `204 No Content`: Producto eliminado
- `400 Bad Request`: ID inválido
- `404 Not Found`: Producto no encontrado

***

##  Validaciones Implementadas

Las validaciones se realizan mediante DTOs y `class-validator` + `class-transformer`.

### CreateProductoDto

- `nombre`
    - Requerido
    - String
    - Mínimo 3 caracteres
    - Máximo 255 caracteres
    - Se hace `trim()` automático
- `precio`
    - Requerido
    - Número
    - Máximo 2 decimales
    - Mayor que 0
    - Límite superior configurado
- `stock`
    - Requerido
    - Entero
    - Mayor o igual a 0
    - Límite superior configurado


### UpdateProductoDto

- Mismos campos que `CreateProductoDto` pero todos **opcionales**
- Permite actualizaciones parciales (PATCH)


### ProductoIdDto

- `id`
    - Requerido en rutas que usan `:id`
    - Debe ser un UUID versión 4 válido


### ValidationPipe Global

Se usa un `ValidationPipe` global configurado para:

- `whitelist: true`: elimina propiedades no declaradas en los DTOs
- `forbidNonWhitelisted: true`: lanza error si se envían propiedades extra
- `transform: true`: transforma tipos primitivos (por ejemplo, strings numéricos a number)

Adicionalmente, se implementa un filtro de excepciones para unificar el formato de errores de validación.

***

## Manejo de Errores

- **Errores de validación**: respuesta con detalles de campos inválidos.
- **Recurso no encontrado**: se lanza `NotFoundException` en el servicio cuando un producto no existe.
- **Errores de base de datos**: delegados al comportamiento estándar de NestJS / TypeORM, que pueden extenderse con filtros personalizados.

***

## Cómo Probar Rápidamente (Ejemplos)

### Crear un producto

```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop HP",
    "precio": 1500.50,
    "stock": 10
  }'
```


### Listar productos

```bash
curl http://localhost:3000/productos
```


### Obtener producto por ID

```bash
curl http://localhost:3000/productos/<uuid>
```


### Actualizar producto

```bash
curl -X PATCH http://localhost:3000/productos/<uuid> \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 1400.00,
    "stock": 8
  }'
```


### Eliminar producto

```bash
curl -X DELETE http://localhost:3000/productos/<uuid>
```

***

## Pruebas Unitarias

El proyecto incluye **16 test cases** con Jest cubriendo la lógica crítica del negocio.

### Ejecutar pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Ver cobertura de código
npm run test:cov
