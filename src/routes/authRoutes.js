const express = require('express');
const router = express.Router();
const { validar, esquemas } = require('../middlewares/validar');
const { registro, login } = require('../controllers/authController');

router.post('/registro', validar(esquemas.registro), registro);
router.post('/login', validar(esquemas.login), login);

module.exports = router;