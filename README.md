Getting started

## 1. Install dependencies

Download this example:

Install npm dependencies:
cd orangestoreback
npm install
Alternative: Clone the entire repo

## 2. Create the database

Run the following command to create your MongoDB database file. This also creates the User and Other tables that are defined in prisma/schema.prisma:

npx prisma

## 3. Run the script

Execute the script with this command:
npm run dev
npx prisma format
npx prisma generate