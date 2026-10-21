const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const [tipo, token] = (req.headers.authorization || '').split(' ');
    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ mensaje: 'Token requerido' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

const soloAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ mensaje: 'Solo para administradores' });
    }
    next();
};

module.exports = { verificarToken, soloAdmin };