const router = require('express').Router();
const db = require('../../conexion');

const librosRouter = require('./libros');
const usuariosRouter = require('./usuarios');

const BASE_URL = 'http://localhost:3000'; 

const transformarLibro = (libro) => {
    if (libro.url_portada && !libro.url_portada.startsWith('http')) {
        libro.url_portada = `${BASE_URL}${libro.url_portada}`;
    }
    return libro;
};

const transformarUsuario = (usuario) => {
    // Asumiendo que tus avatares de usuario también están en /uploads/
    if (usuario.url_avatar && usuario.url_avatar.startsWith('/uploads/')) {
        usuario.url_avatar = `${BASE_URL}${usuario.url_avatar}`;
    }
    return usuario;
};



// Rutas específicas (sin autenticación)
router.use('/libros', librosRouter);
router.use('/usuarios', usuariosRouter);

// GET /api/busqueda?q=termino - Búsqueda general (libros + usuarios)
router.get('/', async function(req, res, next) {
    const { q } = req.query;

    if (!q || q.trim().length < 1) {
        return res.status(400).json({
            error: 'Búsqueda inválida',
            message: 'Debe proporcionar al menos 2 caracteres para buscar'
        });
    }

    const termino = `%${q.trim()}%`;

    try {
        const sqlLibros = `
            SELECT 
                l.id,
                l.titulo,
                l.url_portada
            FROM Libro l
            WHERE l.titulo LIKE ?
        `;

        const sqlUsuarios = `
            SELECT
                u.id,
                u.nombre_usuario,
                u.url_avatar
            FROM Usuario u
            WHERE u.nombre LIKE ?
               OR u.nombre_usuario LIKE ?
        `;

        const [libros] = await db.query(sqlLibros, [termino]);
        const [usuarios] = await db.query(sqlUsuarios, [termino, termino]);

        const librosTransformados = libros.map(transformarLibro);
        const usuariosTransformados = usuarios.map(transformarUsuario);

        res.json({
            status: 'ok',
            libros: librosTransformados,  
            usuarios: usuariosTransformados 
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