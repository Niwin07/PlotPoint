const db = require('../../conexion');

// GET /api/comentarios - Listar comentarios con filtros
exports.listar = async function(req, res, next) {
    const { resena_id, usuario_id } = req.query;

    let sql = `
        SELECT 
            c.id, c.contenido, c.fecha_creacion,
            c.usuario_id, u.nombre_usuario, u.nombre as usuario_nombre, u.url_avatar,
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
        
        res.json({ 
            status: 'ok', 
            comentarios: comentarios,
            total: comentarios.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener comentarios' 
        });
    }
};

// GET /api/comentarios/:id - Obtener un comentario específico
exports.obtener = async function(req, res, next) {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                c.id, c.contenido, c.fecha_creacion,
                c.usuario_id, u.nombre_usuario, u.nombre as usuario_nombre, u.url_avatar,
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

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener el comentario' 
        });
    }
};

// GET /api/comentarios/resena/:resena_id - Obtener todos los comentarios de una reseña
exports.obtenerPorResena = async function(req, res, next) {
    const { resena_id } = req.params;

    try {
        // Verificar que la reseña existe
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
                c.usuario_id, u.nombre_usuario, u.nombre as usuario_nombre, u.url_avatar
            FROM Comentario c
            INNER JOIN Usuario u ON c.usuario_id = u.id
            WHERE c.resena_id = ?
            ORDER BY c.fecha_creacion DESC
        `;
        
        const [comentarios] = await db.query(sql, [resena_id]);
        
        res.json({ 
            status: 'ok', 
            resena_id: resena_id,
            comentarios: comentarios,
            total: comentarios.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener comentarios de la reseña' 
        });
    }
};

// POST /api/comentarios - Crear un nuevo comentario (requiere autenticación)
exports.crear = async function(req, res, next) {
    const { resena_id, contenido } = req.body;
    const usuario_id = req.usuario.id; // Del token JWT

    // Validaciones
    if (!resena_id || !contenido) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'La reseña y el contenido son requeridos' 
        });
    }

    if (typeof contenido !== 'string') {
        return res.status(400).json({ 
            error: 'Contenido inválido',
            message: 'El contenido debe ser texto' 
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
            message: 'El comentario no puede superar los 500 caracteres' 
        });
    }

    try {
        // Validar que la reseña existe
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
};

// DELETE /api/comentarios/:id - Eliminar un comentario (solo el autor o admin)
exports.eliminar = async function(req, res, next) {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const usuario_rol = req.usuario.rol;

    try {
        // Verificar que el comentario existe
        const [comentario] = await db.query("SELECT usuario_id FROM Comentario WHERE id = ?", [id]);
        
        if (comentario.length === 0) {
            return res.status(404).json({ 
                error: 'Comentario no encontrado',
                message: 'No existe un comentario con ese ID' 
            });
        }

        // Verificar que el usuario es el autor o es admin
        if (comentario[0].usuario_id !== usuario_id && usuario_rol !== 'admin') {
            return res.status(403).json({ 
                error: 'Acceso denegado',
                message: 'Solo puedes eliminar tus propios comentarios' 
            });
        }

        const sql = "DELETE FROM Comentario WHERE id = ?";
        await db.query(sql, [id]);

        res.json({ 
            status: 'ok',
            message: 'Comentario eliminado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar el comentario' 
        });
    }
};  