const express = require('express');
const router = express.Router();

const { validar, validarId, esquemas } = require('../middlewares/validar');
const { verificarToken, soloAdmin } = require('../middlewares/auth');
const {
    listarEquipos, obtenerEquipo, crearEquipo, actualizarEquipo, eliminarEquipo
} = require('../controllers/equipoController');

router.use(verificarToken); // todas las rutas requieren login

router.get('/', listarEquipos);
router.get('/:id', validarId, obtenerEquipo);
// Solo el administrador modifica el inventario
router.post('/', soloAdmin, validar(esquemas.equipoCrear), crearEquipo);
router.put('/:id', soloAdmin, validarId, validar(esquemas.equipoActualizar, { minimoUnCampo: true }), actualizarEquipo);
router.delete('/:id', soloAdmin, validarId, eliminarEquipo);

module.exports = router;