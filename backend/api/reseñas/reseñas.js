const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');

const BASE_URL = 'http://localhost:3000';

const transformReseñaURLs = (reseña) => {
    if (reseña.url_portada && !reseña.url_portada.startsWith('http')) {
        reseña.url_portada = `${BASE_URL}${reseña.url_portada}`;
    }
    if (reseña.url_avatar && !reseña.url_avatar.startsWith('http')) {
        reseña.url_avatar = `${BASE_URL}${reseña.url_avatar}`;
    }
    return reseña;
};

router.get('/', async (req, res) => {
    const { libro_id, usuario_id } = req.query;

    let sql = `
        SELECT 
            r.id, r.puntuacion, r.contenido, r.fecha_creacion,
            r.usuario_id, u.nombre_usuario, u.nombre AS usuario_nombre, u.url_avatar,
            r.libro_id, l.titulo AS libro_titulo, l.url_portada
        FROM Resena r
        INNER JOIN Usuario u ON r.usuario_id = u.id
        INNER JOIN Libro l ON r.libro_id = l.id
    `;
    let conditions = [];
    let params = [];

    if (libro_id) {
        conditions.push("r.libro_id = ?");
        params.push(libro_id);
    }

    if (usuario_id) {
        conditions.push("r.usuario_id = ?");
        params.push(usuario_id);
    }

    if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");

    sql += " ORDER BY r.fecha_creacion DESC";

    try {
        const [resenas] = await db.query(sql, params); 

        const resenasTransformadas = resenas.map(transformReseñaURLs);

        res.json({
            status: 'ok',
            resenas: resenasTransformadas,
            total: resenasTransformadas.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener reseñas'
        });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                r.id, r.puntuacion, r.contenido, r.fecha_creacion,
                r.usuario_id, u.nombre_usuario, u.nombre AS usuario_nombre, u.url_avatar,
                r.libro_id, l.titulo AS libro_titulo, l.url_portada, l.isbn
            FROM Resena r
            INNER JOIN Usuario u ON r.usuario_id = u.id
            INNER JOIN Libro l ON r.libro_id = l.id
            WHERE r.id = ?
        `;
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Reseña no encontrada',
                message: 'No existe una reseña con ese ID'
            });
        }

        const reseñaTransformada = transformReseñaURLs(rows[0]);

        res.json(reseñaTransformada); 
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener la reseña'
        });
    }
});

router.post('/', verificarToken, async (req, res) => {
    const { libro_id, puntuacion, contenido } = req.body;
    const usuario_id = req.usuario.id;

    try {
        const [existente] = await db.query(
            "SELECT id FROM Resena WHERE usuario_id = ? AND libro_id = ?",
            [usuario_id, libro_id]
        );

        if (existente.length > 0) {
            return res.status(409).json({
                error: 'Reseña duplicada',
                message: 'Ya has reseñado este libro'
            });
        }

        if (!libro_id || !puntuacion) {
            return res.status(400).json({
                error: 'Datos incompletos',
                message: 'El libro y la puntuación son requeridos'
            });
        }

        const puntuacionesValidas = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        if (!puntuacionesValidas.includes(Number(puntuacion))) {
            return res.status(400).json({
                error: 'Puntuación inválida',
                message: 'La puntuación debe ser entre 1 y 5 con incrementos de 0.5'
            });
        }

        if (contenido && typeof contenido !== 'string') {
            return res.status(400).json({
                error: 'Contenido inválido',
                message: 'El contenido debe ser texto'
            });
        }

        if (contenido && contenido.trim().length < 10) {
            return res.status(400).json({
                error: 'Contenido muy corto',
                message: 'Debe tener al menos 10 caracteres'
            });
        }

        const [libro] = await db.query("SELECT id FROM Libro WHERE id = ?", [libro_id]);
        if (libro.length === 0) {
            return res.status(404).json({
                error: 'Libro no encontrado',
                message: 'El libro especificado no existe'
            });
        }

        const sql = `
            INSERT INTO Resena 
            (usuario_id, libro_id, puntuacion, contenido, fecha_creacion)
            VALUES (?, ?, ?, ?, NOW())
        `;

        const [result] = await db.query(sql, [
            usuario_id,
            libro_id,
            puntuacion,
            contenido ? contenido.trim() : null
        ]);

        res.status(201).json({
            status: 'ok',
            message: 'Reseña creada exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al crear la reseña'
        });
    }
});


router.delete('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const usuario_rol = req.usuario.rol;

    try {
        const [resena] = await db.query(
            "SELECT usuario_id FROM Resena WHERE id = ?",
            [id]
        );

        if (resena.length === 0) {
            return res.status(404).json({
                error: 'Reseña no encontrada',
                message: 'No existe una reseña con ese ID'
            });
        }

        if (resena[0].usuario_id !== usuario_id && usuario_rol !== 'admin') {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes eliminar tus propias reseñas'
            });
        }

        await db.query("DELETE FROM Resena WHERE id = ?", [id]);

        res.json({
            status: 'ok',
            message: 'Reseña eliminada exitosamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al eliminar la reseña'
        });
    }
});

router.get('/libro/:libro_id/promedio', async (req, res) => {
    const { libro_id } = req.params;

    try {
        const sql = `
            SELECT 
                COUNT(*) AS total_resenas,
                AVG(puntuacion) AS promedio,
                MIN(puntuacion) AS minimo,
                MAX(puntuacion) AS maximo
            FROM Resena
            WHERE libro_id = ?
        `;

        const [rows] = await db.query(sql, [libro_id]);

        if (rows[0].total_resenas === 0) {
            return res.json({
                libro_id,
                total_resenas: 0,
                promedio: null,
                minimo: null,
                maximo: null,
                mensaje: 'Este libro aún no tiene reseñas'
            });
        }

        res.json({
            libro_id,
            total_resenas: rows[0].total_resenas,
            promedio: Math.round(rows[0].promedio * 10) / 10,
            minimo: rows[0].minimo,
            maximo: rows[0].maximo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al calcular el promedio'
        });
    }
});

router.get('/mias', verificarToken, async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const sql = `
            SELECT 
                r.id, r.puntuacion, r.contenido, r.fecha_creacion,
                r.usuario_id, u.nombre_usuario, u.nombre AS usuario_nombre, u.url_avatar,
                r.libro_id, l.titulo AS libro_titulo, l.url_portada
            FROM Resena r
            INNER JOIN Usuario u ON r.usuario_id = u.id
            INNER JOIN Libro l ON r.libro_id = l.id
            WHERE r.usuario_id = ?
            ORDER BY r.fecha_creacion DESC
        `;

        const [resenas] = await db.query(sql, [usuario_id]);

        const resenasTransformadas = resenas.map(transformReseñaURLs);

        res.json({
            status: 'ok',
            resenas: resenasTransformadas, 
            total: resenasTransformadas.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener mis reseñas'
        });
    }
});

module.exports = router;
