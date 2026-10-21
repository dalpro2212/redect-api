const express = require('express');
const router = express.Router();

const { validar, validarId, esquemas } = require('../middlewares/validar');
const { verificarEstadoUsuario } = require('../middlewares/estadoUsuario');
const {
    listarPrestamos,
    crearPrestamo,
    devolverPrestamo
} = require('../controllers/prestamoController');

router.get('/', listarPrestamos);
router.post('/', validar(esquemas.prestamoCrear), verificarEstadoUsuario, crearPrestamo);
router.put('/:id/devolver', validarId, devolverPrestamo);

module.exports = router;