const db = require('../../conexion');

// GET /api/likes/usuario/:usuario_id - Obtener todos los libros favoritos de un usuario
exports.obtenerFavoritosUsuario = async function(req, res, next) {
    const { usuario_id } = req.params;

    try {
        // Verificar que el usuario existe
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
        
        res.json({ 
            status: 'ok',
            usuario_id: usuario_id,
            libros_favoritos: libros,
            total: libros.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener libros favoritos' 
        });
    }
};

// GET /api/likes/libro/:libro_id - Obtener todos los usuarios que marcaron un libro como favorito
exports.obtenerUsuariosPorLibro = async function(req, res, next) {
    const { libro_id } = req.params;

    try {
        // Verificar que el libro existe
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
        
        res.json({ 
            status: 'ok',
            libro_id: libro_id,
            usuarios: usuarios,
            total: usuarios.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener usuarios' 
        });
    }
};

// GET /api/likes/check/:libro_id - Verificar si el usuario autenticado marcó un libro como favorito
exports.verificarFavorito = async function(req, res, next) {
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
};

// POST /api/likes - Marcar un libro como favorito (requiere autenticación)
exports.marcarFavorito = async function(req, res, next) {
    const { libro_id } = req.body;
    const usuario_id = req.usuario.id;

    // Validaciones
    if (!libro_id) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'El ID del libro es requerido' 
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

        // Verificar si ya está marcado como favorito
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
};

// DELETE /api/likes/:libro_id - Desmarcar un libro como favorito (requiere autenticación)
exports.desmarcarFavorito = async function(req, res, next) {
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
};

// GET /api/likes/mis-favoritos - Obtener libros favoritos del usuario autenticado
exports.misFavoritos = async function(req, res, next) {
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
        
        // Obtener géneros para cada libro
        for (let libro of libros) {
            const [generos] = await db.query(`
                SELECT g.id, g.nombre 
                FROM Genero g
                INNER JOIN LibroGenero lg ON g.id = lg.genero_id
                WHERE lg.libro_id = ?
            `, [libro.libro_id]);
            libro.generos = generos;
        }
        
        res.json({ 
            status: 'ok',
            libros_favoritos: libros,
            total: libros.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener tus favoritos' 
        });
    }
};