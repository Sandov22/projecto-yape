## Descripcion

Projecto de NestJS. Este projecto es un servidor y base de datos. El servidor permite crear perdidos, actualizar su estado, consultar el estado actual entre otros. El servidor esta en el puerto 6666.

## Base de Datos
La base de datos se ubica en el port 5434, con usuario "postgres" y usa la contraseña 123.<br>

## Correr el programa

Para correr el programa sigue estos pasos:

### Paso 1
```bash
#En la terminal corre este comando para empezar el servidor
$ npm install
#Crea un archivo llamado .env y pon: DATABASE_URL="postgresql://postgres:123@localhost:5434/nest?schema=public"
#Luego corre este commando para inicializar la base de datos
$ docker compose up dv-db -d
#Para empezar prisma corre estos commandos:
npx prisma migrate dev --name init
#Para generar los Status originales en la base de datos corre:
npx ts-node prisma/seed.ts
#Para correr el servidor corre
npm run start:dev
#Opcionalmente, prisma te deja inspeccionar y editar tu base de datos, corre:
npx prisma studio
```

# Queries
Los queries funcionan al añadirle un ? y las variables a ser alteradas al URL. En este proyecto, podemos usar createdAt, deletedAt y updatedAt. No es case sensitive. Las funciones que regresan mas de un objeto pueden ser alteradas por el query. Ademas, puedes usar variso queries a la vez para mayor especificidad. Para usar un query usa el formato: < variable >=< fecha >. Esta fecha puede ser YYYY-MM-DD o YYYY-MM o YYYY. El query filtrara los productos para solo mostros los que coinciden con esa fecha.

# Relaciones
Este proyecto usa tablas intermedias para las relaciones entre objetos. Hay 5 tablas, Orden - Producto, Orden - Estado, Orden - Estado Previo, Producto - Estado y Categoria - Producto.

# Funciones
Aca dejo una lista de los requests posibles:<br>
### Productos
POST /product/new<br>
body:<br>
{<br>
  "name": "Nuevo Producto",<br>
  "categories": ["Electronico","Salud"]<br>
}<br>Este request creara un nuevo producto. En el body pon el nombre del producto y las categorias a las que pertence como en el formato mostrado en el ejemplo.<br>

GET /product/:nombre<br>
Este request te dara el estado del producto que pediste. Pon el nombre del producto en el url.<br>

PATCH /product/updatestatus/:nombre<br>
body:<br>
{<br>
  "status": "INSTOCK"<br>
}<br>
Este request te dejara cambiar el status del producto. Pon el nombre del producto en el url y el nuevo status en el body.<br>

PATCH /order/addcategory/:nombre<br>
body:<br>
{<br>
  "category": "Comida"<br>
}<br>
Este request añadira una categoria a el producto. Pon el nombre del producto en el url y la categoria en el body.

DELETE /product/delete/:nombre<br>
Este request borrara el producto de la base de datos. Pon el nombre del producto en el url.

GET /product/available
Este request regrasara todos los productos con el estado INSTOCK.

GET /product/all
Este request regresara todos los productos no borrados.

### Categorias
POST /category/new<br>
body:<br>
{<br>
  "name": "Categoria",<br>
  "description": "Nueva categoria"<br>
}<br>Este request creara una nuevo categoria. En el body pon el nombre de la categoria y una descripcion.<br>

GET /category/:nombre<br>
Este request te dara los productos asociados a esta categoria. Pon el nombre de la categoria en el url.<br>

DELETE /category/delete/:nombre<br>
Este request borrara la categoria de la base de datos. Pon el nombre de la categoria en el url.

GET /category/all<br>
Este request devolvera todas las categorias no borradas.

### Ordenes
POST /order/new<br>
body:<br>
{<br>
    "products": ["Papa","Tomate","Manzana"]
    "description": "Un nuevo pedido"
}<br>Este request creara una nueva orden. En el body pon los productos como en el formato mostrado en el ejemplo y una descripcion.<br>

GET /order/:id<br>
Este request te dara tu objeto de orden. Pon el id de la orden en el url.<br>

PATCH /order/updatestatus/:id<br>
body:<br>
{<br>
  "status": "PROCESSING"<br>
}<br>
Este request te dejara cambiar el status de la orden. Pon el id de la orden en el url y el nuevo status en el body.<br>

DELETE /order/delete/:id<br>
Este request borrara la orden de la base de datos. Pon el id de la orden en el url.<br>

### ProductStatus
POST /productstate/new<br>
body:<br>
{<br>
    "name": "LIMITED"
}<br>
Este request creara un nuevo Product Status. Pon el nombre en el body.<br>

GET /productstate/get<br>
Este request devolvera todos los Product Status que hay.

DELETE /productstate/delete:nombre<br>
Este request borrara el estado de la base de datos. Pon el id del estado en el url.<br>

### OrderStatus
POST /orderstate/new<br>
body:<br>
{<br>
    "name": "CANCELLED"
}<br>
Este request creara un nuevo Order Status. Pon el nombre en el body.<br>

GET /state/get<br>
Este request devolvera todos los tipos de Order Status que hay.

DELETE /orderstate/delete:nombre<br>
Este request borrara el estado de la base de datos. Pon el id del estado en el url.<br>

## Base de Datos
![Image](DatabaseImage.jpg)