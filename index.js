require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

const equipoRoutes = require('./src/routes/equipoRoutes');
const prestamoRoutes = require('./src/routes/prestamoRoutes');
app.use('/api/prestamos', prestamoRoutes);

app.use('/api/equipos', equipoRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API REDTEC funcionando'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

