const { Equipo } = require('../models');

const listarEquipos = async (req, res) => {
    try {
        const equipos = await Equipo.findAll();
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

        await equipo.destroy();

        res.json({
            mensaje: "Equipo eliminado correctamente"
        });

    } catch (error) {
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