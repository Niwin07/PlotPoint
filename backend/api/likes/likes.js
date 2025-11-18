const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');


const BASE_URL = 'http://localhost:3000';

const transformLibroURL = (libro) => {
    if (libro.url_portada && !libro.url_portada.startsWith('http')) {
        libro.url_portada = `${BASE_URL}${libro.url_portada}`;
    }
    return libro;
};

const transformUsuarioURL = (usuario) => {
    if (usuario.url_avatar && !usuario.url_avatar.startsWith('http')) {
        usuario.url_avatar = `${BASE_URL}${usuario.url_avatar}`;
    }
    return usuario;
};

router.get('/usuario/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const [usuario] = await db.query("SELECT id FROM Usuario WHERE id = ?", [usuario_id]);
        if (usuario.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario especificado no existe'
            });
        }

        const sql = `
            SELECT 
                lk.id as like_id,
                lk.fecha_creacion,
                l.id as libro_id, 
                l.titulo, 
                l.url_portada
            FROM Likes lk
            INNER JOIN Libro l ON lk.libro_id = l.id
            WHERE lk.usuario_id = ?
            ORDER BY lk.fecha_creacion DESC
        `;
        
        const [libros] = await db.query(sql, [usuario_id]);
        
        const librosTransformados = libros.map(transformLibroURL);

        res.json({
            status: 'ok',
            usuario_id,
            libros_favoritos: librosTransformados,
            total: librosTransformados.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener libros favoritos'
        });
    }
});

router.get('/libro/gustados', async (req, res) => {
    try {
        const sql = `
        SELECT
            L.titulo, L.id, L.url_portada,
            COUNT(lk.libro_id) AS total_likes
        FROM Likes AS lk
        JOIN Libro AS L ON lk.libro_id = L.id
        GROUP BY L.id, L.titulo, L.url_portada
        ORDER BY total_likes DESC
        LIMIT 6;
        `;
        
        const [libros] = await db.query(sql);

        const librosTransformados = libros.map(transformLibroURL);

        res.json({
            status: 'ok',
            libros: librosTransformados, 
            total: librosTransformados.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener los más gustados'
        });
    }
});

router.get('/libro/:libro_id', async (req, res) => {
    const { libro_id } = req.params;

    try {
        const [libro] = await db.query("SELECT id FROM Libro WHERE id = ?", [libro_id]);
        if (libro.length === 0) {
            return res.status(404).json({
                error: 'Libro no encontrado',
                message: 'El libro especificado no existe'
            });
        }

        const sql = `
            SELECT 
                lk.id as like_id,
                lk.fecha_creacion,
                u.id as usuario_id,
                u.nombre_usuario,
                u.nombre as usuario_nombre,
                u.url_avatar
            FROM Likes lk
            INNER JOIN Usuario u ON lk.usuario_id = u.id
            WHERE lk.libro_id = ?
            ORDER BY lk.fecha_creacion DESC
        `;
        
        const [usuarios] = await db.query(sql, [libro_id]);
        
        const usuariosTransformados = usuarios.map(transformUsuarioURL);

        res.json({
            status: 'ok',
            libro_id,
            usuarios: usuariosTransformados, 
            total: usuariosTransformados.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener usuarios'
        });
    }
});

router.get('/check/:libro_id', verificarToken, async (req, res) => {
    const { libro_id } = req.params;
    const usuario_id = req.usuario.id;

    try {
        const sql = "SELECT id FROM Likes WHERE usuario_id = ? AND libro_id = ?";
        const [rows] = await db.query(sql, [usuario_id, libro_id]);

        res.json({
            es_favorito: rows.length > 0,
            like_id: rows.length > 0 ? rows[0].id : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al verificar favorito'
        });
    }
});

router.post('/', verificarToken, async (req, res) => {
    const { libro_id } = req.body;
    const usuario_id = req.usuario.id;

    if (!libro_id) {
        return res.status(400).json({
            error: 'Datos incompletos',
            message: 'El ID del libro es requerido'
        });
    }

    try {
        const [libro] = await db.query("SELECT id FROM Libro WHERE id = ?", [libro_id]);
        if (libro.length === 0) {
            return res.status(404).json({
                error: 'Libro no encontrado',
                message: 'El libro especificado no existe'
            });
        }

        const [existente] = await db.query(
            "SELECT id FROM Likes WHERE usuario_id = ? AND libro_id = ?", 
            [usuario_id, libro_id]
        );
        
        if (existente.length > 0) {
            return res.status(409).json({
                error: 'Ya es favorito',
                message: 'Este libro ya está en tus favoritos'
            });
        }

        const sql = `
            INSERT INTO Likes 
            (usuario_id, libro_id, fecha_creacion) 
            VALUES (?, ?, NOW())
        `;
        
        const [result] = await db.query(sql, [usuario_id, libro_id]);

        res.status(201).json({
            status: 'ok',
            message: 'Libro marcado como favorito',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al marcar como favorito'
        });
    }
});

router.delete('/:libro_id', verificarToken, async (req, res) => {
    const { libro_id } = req.params;
    const usuario_id = req.usuario.id;

    try {
        const sql = "DELETE FROM Likes WHERE usuario_id = ? AND libro_id = ?";
        const [result] = await db.query(sql, [usuario_id, libro_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'No encontrado',
                message: 'Este libro no está en tus favoritos'
            });
        }

        res.json({
            status: 'ok',
            message: 'Libro eliminado de favoritos'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al desmarcar favorito'
        });
    }
});


router.get('/mis-favoritos', verificarToken, async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const sql = `
            SELECT 
                lk.id as like_id,
                lk.fecha_creacion,
                l.id as libro_id, 
                l.titulo, 
                l.isbn, 
                l.url_portada,
                l.sinopsis,
                l.paginas,
                l.anio_publicacion,
                a.id as autor_id,
                a.nombre as autor_nombre, 
                a.apellido as autor_apellido,
                e.id as editorial_id,
                e.nombre as editorial_nombre
            FROM Likes lk
            INNER JOIN Libro l ON lk.libro_id = l.id
            LEFT JOIN Autor a ON l.autor_id = a.id
            LEFT JOIN Editorial e ON l.editorial_id = e.id
            WHERE lk.usuario_id = ?
            ORDER BY lk.fecha_creacion DESC
        `;
        
        const [libros] = await db.query(sql, [usuario_id]);

        for (let libro of libros) {
            const [generos] = await db.query(`
                SELECT g.id, g.nombre 
                FROM Genero g
                INNER JOIN LibroGenero lg ON g.id = lg.genero_id
                WHERE lg.libro_id = ?
            `, [libro.libro_id]);
            libro.generos = generos;
        }
        
        const librosTransformados = libros.map(transformLibroURL);

        res.json({
            status: 'ok',
            libros_favoritos: librosTransformados,
            total: librosTransformados.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener tus favoritos'
        });
    }
});

module.exports = router;
