const express = require('express');

const app = express();

app.use(express.json());

const equipoRoutes = require('./src/routes/equipoRoutes');

app.use('/api/equipos', equipoRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API REDTEC funcionando'
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

