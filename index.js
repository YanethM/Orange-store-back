const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { IpFilter, IpDeniedError } = require('express-ipfilter');
const path = require("path");

const userRoutes = require('./src/routes/UserRoutes');
const authRoutes = require('./src/routes/AuthRoutes');
const productRoutes = require('./src/routes/ProductRoutes');
const orderRoutes = require('./src/routes/OrderRoutes');
const deliveryRoutes = require('./src/routes/DeliveryRoutes');
const faqRoutes = require('./src/routes/FaqRoutes');

// Lista de IPs permitidas
/* const allowedIPs = ['181.236.217.148', '181.236.217.20']; */

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Configura el middleware IpFilter
/* app.use(IpFilter(allowedIPs, { mode: 'allow' })); 

// Maneja los errores de IP denegadas
app.use((err, req, res, next) => {
    if (err instanceof IpDeniedError) {
        res.status(401).send('Acceso denegado: tu IP no está permitida');
    } else {
        next(err);
    }
});*/

// RUTAS
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.use('/orders', orderRoutes);
app.use('/deliveries', deliveryRoutes);
app.use('/faqs', faqRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
require('dotenv').config();

// conexión con la base de datos
const CONNECTION_PORT = process.env.PORT || 3005;
app.listen(CONNECTION_PORT, () => {
  console.log(`Server running on port ${CONNECTION_PORT}`);
});
