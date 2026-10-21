const express = require('express');
const router = express.Router();

const { validar, validarId, esquemas } = require('../middlewares/validar');
const {
    listarEquipos,
    obtenerEquipo,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo
} = require('../controllers/equipoController');

router.get('/', listarEquipos);
router.get('/:id', validarId, obtenerEquipo);
router.post('/', validar(esquemas.equipoCrear), crearEquipo);
router.put('/:id', validarId, validar(esquemas.equipoActualizar, { minimoUnCampo: true }), actualizarEquipo);
router.delete('/:id', validarId, eliminarEquipo);

module.exports = router;