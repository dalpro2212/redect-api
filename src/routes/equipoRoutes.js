const express = require('express');
const router = express.Router();

const {
    listarEquipos,
    obtenerEquipo,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo
} = require('../controllers/equipoController');

router.get('/', listarEquipos);
router.get('/:id', obtenerEquipo);
router.post('/', crearEquipo);
router.put('/:id', actualizarEquipo);
router.delete('/:id', eliminarEquipo);

module.exports = router;