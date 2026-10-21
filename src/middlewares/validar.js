const CATEGORIAS = ['audiovisual', 'herramienta', 'laptop'];
const ESTADOS = ['Disponible', 'Prestado', 'En mantenimiento'];

// Valida el body y deja SOLO los campos permitidos (evita que manden campos raros)
const validar = (esquema, { minimoUnCampo = false } = {}) => (req, res, next) => {
    const body = req.body || {};
    const errores = [];
    const limpio = {};

    for (const [campo, regla] of Object.entries(esquema)) {
        const valor = body[campo];
        const vacio = valor === undefined || valor === null || valor === '';

        if (vacio) {
            if (regla.requerido) errores.push(`${campo} es obligatorio`);
            continue;
        }
        if (regla.tipo === 'string') {
            if (typeof valor !== 'string') errores.push(`${campo} debe ser texto`);
            else if (regla.max && valor.length > regla.max) errores.push(`${campo} no puede superar ${regla.max} caracteres`);
        }
        if (regla.tipo === 'entero' && (!Number.isInteger(Number(valor)) || Number(valor) < 1)) {
            errores.push(`${campo} debe ser un entero positivo`);
        }
        if (regla.tipo === 'fecha' && Number.isNaN(Date.parse(valor))) {
            errores.push(`${campo} debe ser una fecha válida`);
        }
        if (regla.enum && !regla.enum.includes(valor)) {
            errores.push(`${campo} debe ser uno de: ${regla.enum.join(', ')}`);
        }
        limpio[campo] = (typeof valor === 'string' && campo !== 'password')
            ? valor.replace(/[]/g, '')
            : valor;    }

    if (minimoUnCampo && Object.keys(limpio).length === 0) {
        errores.push('Envía al menos un campo para actualizar');
    }
    if (errores.length > 0) {
        return res.status(400).json({ mensaje: 'Datos de entrada inválidos', errores });
    }

    req.body = limpio;
    next();
};

// Valida que :id sea un número entero positivo
const validarId = (req, res, next) => {
    if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
        return res.status(400).json({ mensaje: 'El id debe ser un entero positivo' });
    }
    next();
};

const esquemas = {
    equipoCrear: {
        nombre: { requerido: true, tipo: 'string', max: 150 },
        categoria: { requerido: true, tipo: 'string', enum: CATEGORIAS },
        descripcion: { tipo: 'string', max: 1000 },
        estado: { tipo: 'string', enum: ESTADOS }
    },
    equipoActualizar: {
        nombre: { tipo: 'string', max: 150 },
        categoria: { tipo: 'string', enum: CATEGORIAS },
        descripcion: { tipo: 'string', max: 1000 },
        estado: { tipo: 'string', enum: ESTADOS }
    },
    prestamoCrear: {
        userId: { requerido: true, tipo: 'entero' },
        equipoId: { requerido: true, tipo: 'entero' },
        fechaDevolucionEsperada: { requerido: true, tipo: 'fecha' }
    },
        registro: {
        nombre: { requerido: true, tipo: 'string', max: 100 },
        email: { requerido: true, tipo: 'string', max: 150 },
        password: { requerido: true, tipo: 'string', max: 100 }
    },
    login: {
        email: { requerido: true, tipo: 'string', max: 150 },
        password: { requerido: true, tipo: 'string', max: 100 }
    }
};

module.exports = { validar, validarId, esquemas };