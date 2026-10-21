const express = require('express');
const router = express.Router();
const { validar, esquemas } = require('../middlewares/validar');
const { verificarToken } = require('../middlewares/auth');
const { registro, login, cambiarPassword } = require('../controllers/authController');

router.post('/registro', validar(esquemas.registro), registro);
router.post('/login', validar(esquemas.login), login);
router.put('/password', verificarToken, validar(esquemas.cambiarPassword), cambiarPassword);

module.exports = router;