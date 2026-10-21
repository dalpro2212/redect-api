const { Prestamo, Equipo, User, sequelize } = require('../models');

// Error con código HTTP para cortar la transacción
const fallo = (status, mensaje) => Object.assign(new Error(mensaje), { status });

const listarPrestamos = async (req, res) => {
    try {
        const where = req.user.rol === 'admin' ? {} : { userId: req.user.id };

        const prestamos = await Prestamo.findAll({
            where,
            include: [
                { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
                { model: Equipo, as: 'equipo' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const crearPrestamo = async (req, res) => {
    const { userId, equipoId, fechaDevolucionEsperada } = req.body;

    if (new Date(fechaDevolucionEsperada) <= new Date()) {
        return res.status(400).json({ mensaje: 'La fecha de devolución debe ser futura' });
    }

    try {
        const prestamo = await sequelize.transaction(async (t) => {
            const equipo = await Equipo.findByPk(equipoId, { transaction: t, lock: t.LOCK.UPDATE });
            if (!equipo) throw fallo(404, 'Equipo no encontrado');
            if (equipo.estado !== 'Disponible') {
                throw fallo(409, `El equipo no está disponible (estado: ${equipo.estado})`);
            }

            const nuevo = await Prestamo.create(
                { userId, equipoId, fechaDevolucionEsperada },
                { transaction: t }
            );
            await equipo.update({ estado: 'Prestado' }, { transaction: t });
            return nuevo;
        });

        res.status(201).json(prestamo);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

const devolverPrestamo = async (req, res) => {
    try {
        const prestamo = await sequelize.transaction(async (t) => {
            const p = await Prestamo.findByPk(req.params.id, { transaction: t, lock: t.LOCK.UPDATE });
            if (!p) throw fallo(404, 'Préstamo no encontrado');
                        if (req.user.rol !== 'admin' && p.userId !== req.user.id) {
                throw fallo(403, 'No puedes devolver un préstamo de otro usuario');
            }
            if (p.estado === 'Devuelto') throw fallo(409, 'Este préstamo ya fue devuelto');

            await p.update({ estado: 'Devuelto', fechaDevolucionReal: new Date() }, { transaction: t });
            await Equipo.update(
                { estado: 'Disponible' },
                { where: { id: p.equipoId }, transaction: t }
            );
            return p;
        });

        res.json(prestamo);
    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message });
    }
};

module.exports = { listarPrestamos, crearPrestamo, devolverPrestamo };