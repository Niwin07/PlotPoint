const db = require('../../conexion');

// GET /api/resenas - Listar todas las reseñas con filtros
exports.listar = async function(req, res, next) {
    const { libro_id, usuario_id } = req.query;

    let sql = `
        SELECT 
            r.id, r.puntuacion, r.contenido, r.fecha_creacion,
            r.usuario_id, u.nombre_usuario, u.nombre as usuario_nombre, u.url_avatar,
            r.libro_id, l.titulo as libro_titulo, l.url_portada
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
    
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }
    
    sql += " ORDER BY r.fecha_creacion DESC";

    try {
        const [resenas] = await db.query(sql, params);
        
        res.json({ 
            status: 'ok', 
            resenas: resenas,
            total: resenas.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener reseñas' 
        });
    }
};

// GET /api/resenas/:id - Obtener una reseña específica
exports.obtener = async function(req, res, next) {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                r.id, r.puntuacion, r.contenido, r.fecha_creacion,
                r.usuario_id, u.nombre_usuario, u.nombre as usuario_nombre, u.url_avatar,
                r.libro_id, l.titulo as libro_titulo, l.url_portada, l.isbn
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

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener la reseña' 
        });
    }
};

// POST /api/resenas - Crear una nueva reseña (requiere autenticación)
exports.crear = async function(req, res, next) {
    const { libro_id, puntuacion, contenido } = req.body;
    const usuario_id = req.usuario.id; // Del token JWT

    // Validaciones

    // Verificar que el usuario no haya reseñado este libro antes
        const [reseñaExistente] = await db.query(
            "SELECT id FROM Resena WHERE usuario_id = ? AND libro_id = ?", 
            [usuario_id, libro_id]
        );
        
        if (reseñaExistente.length > 0) {
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

    // Validar puntuación (solo valores: 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
    const puntuacionesValidas = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    if (!puntuacionesValidas.includes(Number(puntuacion))) {
        return res.status(400).json({ 
            error: 'Puntuación inválida',
            message: 'La puntuación debe ser un valor entre 1 y 5 (con intervalos de 0.5)' 
        });
    }

    // Validar contenido si se proporciona
    if (contenido && typeof contenido !== 'string') {
        return res.status(400).json({ 
            error: 'Contenido inválido',
            message: 'El contenido debe ser texto' 
        });
    }

    if (contenido && contenido.trim().length < 10) {
        return res.status(400).json({ 
            error: 'Contenido muy corto',
            message: 'El contenido debe tener al menos 10 caracteres' 
        });
    }

    try {
        // Validar que el libro existe
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
};

// DELETE /api/resenas/:id - Eliminar una reseña (solo el autor puede eliminarla)
exports.eliminar = async function(req, res, next) {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const usuario_rol = req.usuario.rol;

    try {
        // Verificar que la reseña existe
        const [resena] = await db.query("SELECT usuario_id FROM Resena WHERE id = ?", [id]);
        
        if (resena.length === 0) {
            return res.status(404).json({ 
                error: 'Reseña no encontrada',
                message: 'No existe una reseña con ese ID' 
            });
        }

        // Verificar que el usuario es el autor o es admin
        if (resena[0].usuario_id !== usuario_id && usuario_rol !== 'admin') {
            return res.status(403).json({ 
                error: 'Acceso denegado',
                message: 'Solo puedes eliminar tus propias reseñas' 
            });
        }

        const sql = "DELETE FROM Resena WHERE id = ?";
        await db.query(sql, [id]);

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
};

// GET /api/resenas/libro/:libro_id/promedio - Obtener promedio de puntuaciones de un libro
exports.obtenerPromedio = async function(req, res, next) {
    const { libro_id } = req.params;

    try {
        const sql = `
            SELECT 
                COUNT(*) as total_resenas,
                AVG(puntuacion) as promedio,
                MIN(puntuacion) as minimo,
                MAX(puntuacion) as maximo
            FROM Resena 
            WHERE libro_id = ?
        `;
        const [rows] = await db.query(sql, [libro_id]);

        if (rows[0].total_resenas === 0) {
            return res.json({ 
                libro_id: libro_id,
                total_resenas: 0,
                promedio: null,
                minimo: null,
                maximo: null,
                mensaje: 'Este libro aún no tiene reseñas'
            });
        }

        res.json({
            libro_id: libro_id,
            total_resenas: rows[0].total_resenas,
            promedio: Math.round(rows[0].promedio * 10) / 10, // Redondear a 1 decimal
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
};

// GET /api/resenas/mias - Listar reseñas del usuario autenticado
exports.listarMias = async function(req, res, next) {
    
    // El ID se obtiene del token verificado
    const usuario_id = req.usuario.id; 

    try {
        const sql = `
            SELECT 
                r.id, r.puntuacion, r.contenido, r.fecha_creacion,
                r.usuario_id, u.nombre_usuario, u.nombre as usuario_nombre, u.url_avatar,
                r.libro_id, l.titulo as libro_titulo, l.url_portada
            FROM Resena r
            INNER JOIN Usuario u ON r.usuario_id = u.id
            INNER JOIN Libro l ON r.libro_id = l.id
            WHERE r.usuario_id = ?
            ORDER BY r.fecha_creacion DESC
        `;
        
        const [resenas] = await db.query(sql, [usuario_id]);
        
        res.json({ 
            status: 'ok', 
            resenas: resenas,
            total: resenas.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener mis reseñas' 
        });
    }
};