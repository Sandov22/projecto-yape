## Descripcion

Projecto de NestJS. Este projecto es un servidor y base de datos. El servidor permite crear perdidos, actualizar su estado, consultar el estado actual entre otros.

## Base de Datos
La base de datos se ubica en el port 5434, con usuario "postgres" y usa la contraseña 123.<br>

## Correr el programa

Para correr el programa sigue estos pasos:

### Paso 1
```bash
#En la terminal corre este comando para empezar el servidor
$ yarn start:dev 
#Luego corre este commando para inicializar la base de datos
$ docker compose up dv-db -d
#Luego corre este comando para generar los Status para la base de datos
$ npx prisma db seed
```

### Paso 2
Hay tres requests que puedes hacer:<br>
GET /get/:id<br>
Este request te devolvera un objecto con el status de tu pedido. El id es el de tu pedido y se obtiene cuando se crea un pedido.<br>
POST /new<br>
Este request necesita un Body con los campos products y description. En este caso, products es un string con el ID de los productos separado por comos. (Eg. 0,1,2,3). Description es un string.<br>
Te devolvera un objecto de orden con id, descripcion, status y una matriz de los estados por los que ha pasado vacia.<br>
PATCH /update/:id<br>
Este request necesita un Body con el campo status el cual contiene el nuevo Status. El id en el URL es el de tu pedido.<br>
Te devolvera un objeto de orden con id, descripcion, status y una matriz de los estados por los que ha pasado actualizada.<br>

## Posdata
Yo he utilizado prisma para ver la base de datos. El comando para usarlo es:
```bash
npx prisma studio
```
Aca podra ver claramente como se actualiza la base de datos. Tambien he usado insomnia para hacer los requests.