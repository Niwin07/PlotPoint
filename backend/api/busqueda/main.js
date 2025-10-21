const router = require('express').Router();
const db = require('../../conexion');

const librosRouter = require('./libros');
const usuariosRouter = require('./usuarios');

// Rutas específicas (sin autenticación)
router.use('/libros', librosRouter);
router.use('/usuarios', usuariosRouter);

// GET /api/busqueda?q=termino - Búsqueda general (libros + usuarios)
router.get('/', async function(req, res, next) {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
        return res.status(400).json({
            error: 'Búsqueda inválida',
            message: 'Debe proporcionar al menos 2 caracteres para buscar'
        });
    }

    const termino = `%${q.trim()}%`;

    try {
        // Búsqueda en libros - SOLO lo necesario: titulo y portada
        const sqlLibros = `
            SELECT 
                l.id,
                l.titulo,
                l.url_portada
            FROM Libro l
            WHERE l.titulo LIKE ?
            LIMIT 10
        `;

        // Búsqueda en usuarios - SOLO lo necesario: nombre_usuario y avatar
        const sqlUsuarios = `
            SELECT
                u.id,
                u.nombre_usuario,
                u.url_avatar
            FROM Usuario u
            WHERE u.nombre LIKE ?
               OR u.nombre_usuario LIKE ?
            LIMIT 10
        `;

        const [libros] = await db.query(sqlLibros, [termino]);
        const [usuarios] = await db.query(sqlUsuarios, [termino, termino]);

        res.json({
            status: 'ok',
            libros: libros,
            usuarios: usuarios
        });

    } catch (error) {
        console.error('Error en búsqueda general:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al realizar la búsqueda'
        });
    }
});

module.exports = router;