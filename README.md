Getting started

## 1. Install dependencies

Download this example:

Install npm dependencies:
cd orangestoreback
npm install
Alternative: Clone the entire repo

 sudo mysql -u root -p

## 2. Create the database

Run the following command to create your MongoDB database file. This also creates the User and Other tables that are defined in prisma/schema.prisma:

npx prisma

## 3. Run the script

Execute the script with this command:
npm run dev
npx prisma format
npx prisma generate
---npx prisma migrate dev
npx prisma push db

## Endpoints

### Registro y login
http://localhost:3002/auth/signup
http://localhost:3002/auth/login

#### Creacion, listar, buscar por id, editar y eliminar por id usuarios
http://localhost:3002/users/new-user
http://localhost:3002/users
http://localhost:3002/users/:id
http://localhost:3002/users/edit/:id
http://localhost:3002/users/remove/:id

#### Creacion, listar, buscar por id, editar y eliminar por id productos
http://localhost:3002/products/new-product
http://localhost:3002/products
http://localhost:3002/products/:id
http://localhost:3002/products/edit/:id
http://localhost:3002/products/remove/:id

#### Creacion, listar, buscar por id, editar y eliminar por id ordenes
### ordenes modifica OrderProduct por eso no existe endpoints de este modelo por aparte
### El total se captura de la orden de compra, precio producto * cantidad
http://localhost:3002/orders/new-order
http://localhost:3002/orders
http://localhost:3002/orders/:id
http://localhost:3002/orders/edit/:id
http://localhost:3002/orders/remove/:id


Falta restablecer contraseña y falta asignar a los registros 