const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');


const BASE_URL = 'http://localhost:3000';

const transformComentsURLs = (coments) => {
    if (coments.url_portada && !coments.url_portada.startsWith('http')) {
        coments.url_portada = `${BASE_URL}${coments.url_portada}`;
    }
    if (coments.url_avatar && !coments.url_avatar.startsWith('http')) {
        coments.url_avatar = `${BASE_URL}${coments.url_avatar}`;
    }
    return coments;
};


router.get('/', async (req, res) => {
    const { resena_id, usuario_id } = req.query;

    let sql = `
        SELECT 
            c.id, c.contenido, c.fecha_creacion,
            c.usuario_id, u.nombre_usuario, u.nombre AS usuario_nombre, u.url_avatar,
            c.resena_id
        FROM Comentario c
        INNER JOIN Usuario u ON c.usuario_id = u.id
    `;

    let conditions = [];
    let params = [];

    if (resena_id) {
        conditions.push("c.resena_id = ?");
        params.push(resena_id);
    }

    if (usuario_id) {
        conditions.push("c.usuario_id = ?");
        params.push(usuario_id);
    }

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY c.fecha_creacion DESC";

    try {
        const [comentarios] = await db.query(sql, params);
        const comentariosTransformados = comentarios.map(transformComentsURLs);
        res.json({
            status: 'ok',
            comentarios: comentariosTransformados,
            total: comentariosTransformados.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener comentarios'
        });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                c.id, c.contenido, c.fecha_creacion,
                c.usuario_id, u.nombre_usuario, u.nombre AS usuario_nombre, u.url_avatar,
                c.resena_id
            FROM Comentario c
            INNER JOIN Usuario u ON c.usuario_id = u.id
            WHERE c.id = ?
        `;
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Comentario no encontrado',
                message: 'No existe un comentario con ese ID'
            });
        }
        const comentarioTransformado = transformComentsURLs(rows[0]);   
        res.json(comentarioTransformado);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener el comentario'
        });
    }
});

router.get('/resena/:resena_id', async (req, res) => {
    const { resena_id } = req.params;

    try {
        const [resena] = await db.query("SELECT id FROM Resena WHERE id = ?", [resena_id]);
        if (resena.length === 0) {
            return res.status(404).json({
                error: 'Reseña no encontrada',
                message: 'La reseña especificada no existe'
            });
        }

        const sql = `
            SELECT 
                c.id, c.contenido, c.fecha_creacion,
                c.usuario_id, u.nombre_usuario, u.nombre AS usuario_nombre, u.url_avatar
            FROM Comentario c
            INNER JOIN Usuario u ON c.usuario_id = u.id
            WHERE c.resena_id = ?
            ORDER BY c.fecha_creacion DESC
        `;
        
        const [comentarios] = await db.query(sql, [resena_id]);
        const comentariosTransformados = comentarios.map(transformComentsURLs);
        res.json({  
            status: 'ok',
            comentarios: comentariosTransformados,
            total: comentariosTransformados.length  
        }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener comentarios de la reseña'
        });
    }
});

router.post('/', verificarToken, async (req, res) => {
    const { resena_id, contenido } = req.body;
    const usuario_id = req.usuario.id;

    if (!resena_id || !contenido) {
        return res.status(400).json({
            error: 'Datos incompletos',
            message: 'La reseña y el contenido son requeridos'
        });
    }

    if (contenido.trim().length < 1) {
        return res.status(400).json({
            error: 'Contenido vacío',
            message: 'El comentario no puede estar vacío'
        });
    }

    if (contenido.trim().length > 500) {
        return res.status(400).json({
            error: 'Contenido muy largo',
            message: 'Máximo 500 caracteres'
        });
    }

    try {
        const [resena] = await db.query("SELECT id FROM Resena WHERE id = ?", [resena_id]);
        if (resena.length === 0) {
            return res.status(404).json({
                error: 'Reseña no encontrada',
                message: 'La reseña especificada no existe'
            });
        }

        const sql = `
            INSERT INTO Comentario 
            (usuario_id, resena_id, contenido, fecha_creacion)
            VALUES (?, ?, ?, NOW())
        `;

        const [result] = await db.query(sql, [
            usuario_id,
            resena_id,
            contenido.trim()
        ]);

        res.status(201).json({
            status: 'ok',
            message: 'Comentario creado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al crear el comentario'
        });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const usuario_rol = req.usuario.rol;

    try {
        const [comentario] = await db.query("SELECT usuario_id FROM Comentario WHERE id = ?", [id]);
        
        if (comentario.length === 0) {
            return res.status(404).json({
                error: 'Comentario no encontrado',
                message: 'No existe un comentario con ese ID'
            });
        }

        if (comentario[0].usuario_id !== usuario_id && usuario_rol !== 'admin') {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes eliminar tus propios comentarios'
            });
        }

        await db.query("DELETE FROM Comentario WHERE id = ?", [id]);

        res.json({
            status: 'ok',
            message: 'Comentario eliminado exitosamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar comentario'
        });
    }
});

module.exports = router;
