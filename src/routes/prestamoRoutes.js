const express = require('express');
const router = express.Router();

const { validar, validarId, esquemas } = require('../middlewares/validar');
const { verificarToken } = require('../middlewares/auth');
const { verificarEstadoUsuario } = require('../middlewares/estadoUsuario');
const { listarPrestamos, crearPrestamo, devolverPrestamo } = require('../controllers/prestamoController');

router.use(verificarToken);

const usuarioDelToken = (req, res, next) => {
    req.body = { ...req.body, userId: req.user.id };
    next();
};

router.get('/', listarPrestamos);
router.post('/', usuarioDelToken, validar(esquemas.prestamoCrear), verificarEstadoUsuario, crearPrestamo);
router.put('/:id/devolver', validarId, devolverPrestamo);

module.exports = router;