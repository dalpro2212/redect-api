const { Equipo } = require('../models');

const listarEquipos = async (req, res) => {
    try {
        // Permite filtrar: GET /api/equipos?estado=Disponible
        const where = req.query.estado ? { estado: req.query.estado } : {};
        const equipos = await Equipo.findAll({ where });
        res.json(equipos);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const obtenerEquipo = async (req, res) => {
    try {
        const equipo = await Equipo.findByPk(req.params.id);

        if (!equipo) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        res.json(equipo);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const crearEquipo = async (req, res) => {
    try {
        // req.body ya viene filtrado y validado por el middleware "validar"
        const equipo = await Equipo.create(req.body);

        res.status(201).json(equipo);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const actualizarEquipo = async (req, res) => {
    try {
        const equipo = await Equipo.findByPk(req.params.id);

        if (!equipo) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        await equipo.update(req.body);

        res.json(equipo);

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const eliminarEquipo = async (req, res) => {
    try {
        const equipo = await Equipo.findByPk(req.params.id);

        if (!equipo) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        if (equipo.estado === 'Prestado') {
            return res.status(409).json({
                mensaje: "No se puede eliminar un equipo prestado"
            });
        }

        await equipo.destroy();

        res.json({
            mensaje: "Equipo eliminado correctamente"
        });

    } catch (error) {
        // Si el equipo tiene historial de préstamos, MySQL bloquea el borrado
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                mensaje: "El equipo tiene historial de préstamos y no se puede eliminar"
            });
        }
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    listarEquipos,
    obtenerEquipo,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo
};