const router = require('express').Router();
const db = require('../../conexion');

const BASE_URL = 'http://localhost:3000'; 

const transformarLibro = (libro) => {
    if (libro.url_portada && !libro.url_portada.startsWith('http')) {
        libro.url_portada = `${BASE_URL}${libro.url_portada}`;
    }
    return libro;
};

// GET /api/busqueda/libros?q=termino&genero=ficcion&autor=nombre&ordenar=titulo
router.get('/', async function(req, res, next) {
    const { q, genero, autor, ordenar = 'titulo', limite = '20' } = req.query;

    try {
        let sql = `
            SELECT DISTINCT
                l.id,
                l.titulo,
                l.url_portada
            FROM Libro l
            LEFT JOIN LibroGenero lg ON l.id = lg.libro_id
            LEFT JOIN Genero g ON lg.genero_id = g.id
            WHERE 1=1
        `;
        
        const params = [];

        // Filtro por género (PRIMERO - más restrictivo)
        if (genero && genero.trim().length > 0) {
            sql += ` AND l.id IN (
                SELECT lg2.libro_id 
                FROM LibroGenero lg2
                INNER JOIN Genero g2 ON lg2.genero_id = g2.id
                WHERE g2.nombre = ?
            )`;
            params.push(genero.trim());
        }

        // Búsqueda por texto general (SEGUNDO - dentro del género filtrado)
        if (q && q.trim().length >= 1) {
            sql += ` AND l.titulo LIKE ?`;
            const terminoBusqueda = `%${q.trim()}%`;
            params.push(terminoBusqueda);
        }

        // Filtro adicional por nombre de autor (si viene específico)
        if (autor && autor.trim().length > 0) {
            sql += ` AND l.id IN (
                SELECT l2.id
                FROM Libro l2
                LEFT JOIN Autor a2 ON l2.autor_id = a2.id
                WHERE a2.nombre LIKE ? OR a2.apellido LIKE ?
            )`;
            const autorBusqueda = `%${autor.trim()}%`;
            params.push(autorBusqueda, autorBusqueda);
        }

        sql += ` ORDER BY l.titulo ASC`;

        // Límite de resultados
        const limiteNum = parseInt(limite);
        if (limiteNum > 0 && limiteNum <= 100) {
            sql += ` LIMIT ?`;
            params.push(limiteNum);
        } else {
            sql += ` LIMIT 20`;
        }

        const [libros] = await db.query(sql, params);

        const librosTransformados = libros.map(transformarLibro);

        res.json({
            status: 'ok',
            libros: librosTransformados 
        });

    } catch (error) {
        console.error('Error en búsqueda de libros:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al buscar libros',
            detalle: error.message
        });
    }
});

// GET /api/busqueda/libros/generos - (Sin cambios, no devuelve imágenes)
router.get('/generos', async function(req, res, next) {
    try {
        const [generos] = await db.query(`
            SELECT 
                g.id,
                g.nombre,
                g.descripcion,
                COUNT(DISTINCT lg.libro_id) as cantidad
            FROM Genero g
            LEFT JOIN LibroGenero lg ON g.id = lg.genero_id
            WHERE g.nombre IS NOT NULL AND g.nombre != ''
            GROUP BY g.id, g.nombre, g.descripcion
            ORDER BY cantidad DESC, g.nombre ASC
        `);

        res.json({
            status: 'ok',
            generos: generos
        });

    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener géneros',
            detalle: error.message
        });
    }
});

// GET /api/busqueda/libros/autores - (Sin cambios, no devuelve imágenes)
router.get('/autores', async function(req, res, next) {
    const { q } = req.query;

    try {
        let sql = `
            SELECT DISTINCT 
                a.id,
                a.nombre,
                a.apellido,
                CONCAT(a.nombre, ' ', a.apellido) as nombre_completo,
                COUNT(DISTINCT l.id) as cantidad_libros
            FROM Autor a
            INNER JOIN Libro l ON l.autor_id = a.id
            WHERE a.nombre IS NOT NULL AND a.nombre != ''
        `;
        const params = [];

        if (q && q.trim().length >= 2) {
            sql += ` AND (a.nombre LIKE ? OR a.apellido LIKE ?)`;
            const busqueda = `%${q.trim()}%`;
            params.push(busqueda, busqueda);
        }

        sql += ` GROUP BY a.id, a.nombre, a.apellido`;
        sql += ` ORDER BY a.apellido ASC, a.nombre ASC LIMIT 50`;

        const [autores] = await db.query(sql, params);

        res.json({
            status: 'ok',
            autores: autores
        });

    } catch (error) {
        console.error('Error al obtener autores:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener autores',
            detalle: error.message
        });
    }
});

// GET /api/busqueda/libros/:id/generos - (Sin cambios, no devuelve imágenes)
router.get('/:id/generos', async function(req, res, next) {
    const { id } = req.params;

    try {
        const [generos] = await db.query(`
            SELECT 
                g.id,
                g.nombre,
                g.descripcion
            FROM Genero g
            INNER JOIN LibroGenero lg ON g.id = lg.genero_id
            WHERE lg.libro_id = ?
            ORDER BY g.nombre ASC
        `, [id]);

        res.json({
            status: 'ok',
            libro_id: id,
            generos: generos
        });

    } catch (error) {
        console.error('Error al obtener géneros del libro:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener géneros del libro',
            detalle: error.message
        });
    }
});

module.exports = router;