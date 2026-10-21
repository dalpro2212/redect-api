const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const existe = await User.findOne({ where: { email } });
        if (existe) return res.status(409).json({ mensaje: 'El email ya está registrado' });

        const hash = await bcrypt.hash(password, 10);
        // El rol siempre es "usuario": nadie puede registrarse como admin
        const user = await User.create({ nombre, email, password: hash, rol: 'usuario' });
        res.status(201).json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        const ok = user && await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

        const token = jwt.sign(
            { id: user.id, rol: user.rol, nombre: user.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        res.json({ token, usuario: { id: user.id, nombre: user.nombre, rol: user.rol } });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { registro, login };