require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet()); // cabeceras de seguridad
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' })); // CORS restringido
app.use(express.json({ limit: '10kb' }));
app.use(express.static('public')); // frontend

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/equipos', require('./src/routes/equipoRoutes'));
app.use('/api/prestamos', require('./src/routes/prestamoRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en puerto ${PORT}`));