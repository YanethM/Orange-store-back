const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./src/routes/UserRoutes');
const authRoutes = require('./src/routes/AuthRoutes');
const productRoutes = require('./src/routes/ProductRoutes');
const orderRoutes = require('./src/routes/OrderRoutes');


const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// RUTAS
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


app.use('/uploads', express.static('uploads'));
require('dotenv').config();

// conexión con la base de datos
const CONNECTION_PORT = process.env.PORT || 3005;
app.listen(CONNECTION_PORT, () => {
  console.log(`Server running on port ${CONNECTION_PORT}`);
});
