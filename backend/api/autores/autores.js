const db = require('../../conexion');

// GET /api/autores - Listar todos los autores (con búsqueda opcional)
exports.listar = async function(req, res, next) {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, apellido, nacionalidad FROM Autor";
    let params = [];
    
    if (busqueda) {
        sql += " WHERE nombre LIKE ? OR apellido LIKE ? OR nacionalidad LIKE ?";
        const busquedaParcial = `%${busqueda}%`;
        params = [busquedaParcial, busquedaParcial, busquedaParcial];
    }

    sql += " ORDER BY apellido, nombre";

    try {
        const [rows] = await db.query(sql, params);
        res.json({ 
            status: 'ok', 
            autores: rows,
            total: rows.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener autores' 
        });
    }
};

// GET /api/autores/:id - Obtener un autor específico
exports.obtener = async function(req, res, next) {
    const { id } = req.params;

    try {
        const sql = "SELECT id, nombre, apellido, nacionalidad FROM Autor WHERE id = ?";
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                error: 'Autor no encontrado',
                message: 'No existe un autor con ese ID' 
            });
        }

        // Obtener libros del autor
        const sqlLibros = `
            SELECT id, titulo, anio_publicacion 
            FROM Libro 
            WHERE autor_id = ? 
            ORDER BY anio_publicacion DESC
        `;
        const [libros] = await db.query(sqlLibros, [id]);

        res.json({ 
            ...rows[0],
            libros: libros 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener el autor' 
        });
    }
};

// POST /api/autores - Crear un nuevo autor
exports.crear = async function(req, res, next) {
    const { nombre, apellido, nacionalidad } = req.body;

    // Validaciones
    if (!nombre) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'El nombre del autor es requerido' 
        });
    }

    if (typeof nombre !== 'string') {
        return res.status(400).json({ 
            error: 'Datos inválidos',
            message: 'El nombre debe ser texto' 
        });
    }

    if (nombre.trim().length < 2) {
        return res.status(400).json({ 
            error: 'Nombre inválido',
            message: 'El nombre debe tener al menos 2 caracteres' 
        });
    }

    try {
        const sql = "INSERT INTO Autor (nombre, apellido, nacionalidad) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [
            nombre.trim(),
            apellido ? apellido.trim() : null,
            nacionalidad ? nacionalidad.trim() : null
        ]);

        res.status(201).json({ 
            status: 'ok',
            message: 'Autor creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al crear el autor' 
        });
    }
};

// PUT /api/autores/:id - Actualizar un autor
exports.actualizar = async function(req, res, next) {
    const { id } = req.params;
    const { nombre, apellido, nacionalidad } = req.body;

    if (!nombre && !apellido && nacionalidad === undefined) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Debe proporcionar al menos un campo para actualizar' 
        });
    }

    const updates = [];
    const params = [];

    if (nombre) {
        if (nombre.trim().length < 2) {
            return res.status(400).json({ 
                error: 'Nombre inválido',
                message: 'El nombre debe tener al menos 2 caracteres' 
            });
        }
        updates.push("nombre = ?");
        params.push(nombre.trim());
    }

    if (apellido !== undefined) {
        updates.push("apellido = ?");
        params.push(apellido ? apellido.trim() : null);
    }

    if (nacionalidad !== undefined) {
        updates.push("nacionalidad = ?");
        params.push(nacionalidad ? nacionalidad.trim() : null);
    }

    const sql = `UPDATE Autor SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    try {
        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Autor no encontrado',
                message: 'No existe un autor con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Autor actualizado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al actualizar el autor' 
        });
    }
};

// DELETE /api/autores/:id - Eliminar un autor
exports.eliminar = async function(req, res, next) {
    const { id } = req.params;

    try {
        // Verificar si tiene libros asociados
        const [libros] = await db.query("SELECT COUNT(*) as total FROM Libro WHERE autor_id = ?", [id]);
        
        if (libros[0].total > 0) {
            return res.status(409).json({ 
                error: 'No se puede eliminar',
                message: `El autor tiene ${libros[0].total} libro(s) asociado(s). Elimínelos primero o asígneles otro autor.` 
            });
        }

        const sql = "DELETE FROM Autor WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Autor no encontrado',
                message: 'No existe un autor con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Autor eliminado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar el autor' 
        });
    }
};