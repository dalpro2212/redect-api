const { Op } = require('sequelize');
const { User, Prestamo } = require('../models');

const MAX_PRESTAMOS = 2;

const verificarEstadoUsuario = async (req, res, next) => {
    try {
        const userId = Number(req.body.userId);

        const usuario = await User.findByPk(userId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Sanción automática: préstamos activos con fecha de devolución vencida
        const vencidos = await Prestamo.count({
            where: {
                userId,
                estado: 'Activo',
                fechaDevolucionEsperada: { [Op.lt]: new Date() }
            }
        });
        if (vencidos > 0) {
            return res.status(403).json({
                mensaje: 'Sanción activa: tienes préstamos vencidos. Devuélvelos para pedir nuevos equipos.'
            });
        }

        // Límite de 2 equipos simultáneos (solo usuarios comunes)
        if (usuario.rol === 'usuario') {
            const activos = await Prestamo.count({ where: { userId, estado: 'Activo' } });
            if (activos >= MAX_PRESTAMOS) {
                return res.status(409).json({
                    mensaje: `Un usuario no puede tener más de ${MAX_PRESTAMOS} equipos prestados a la vez`
                });
            }
        }

        next();
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = { verificarEstadoUsuario };