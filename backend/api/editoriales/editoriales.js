const db = require('../../conexion');

// GET /api/editoriales - Listar todas las editoriales
exports.listar = async function(req, res, next) {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, pais FROM Editorial";
    let params = [];
    
    if (busqueda) {
        sql += " WHERE nombre LIKE ? OR pais LIKE ?";
        const busquedaParcial = `%${busqueda}%`;
        params = [busquedaParcial, busquedaParcial];
    }

    sql += " ORDER BY nombre";

    try {
        const [rows] = await db.query(sql, params);
        res.json({ 
            status: 'ok', 
            editoriales: rows,
            total: rows.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener editoriales' 
        });
    }
};

// GET /api/editoriales/:id - Obtener una editorial específica
exports.obtener = async function(req, res, next) {
    const { id } = req.params;

    try {
        const sql = "SELECT id, nombre, pais FROM Editorial WHERE id = ?";
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                error: 'Editorial no encontrada',
                message: 'No existe una editorial con ese ID' 
            });
        }

        // Obtener libros de la editorial
        const sqlLibros = `
            SELECT id, titulo, anio_publicacion 
            FROM Libro 
            WHERE editorial_id = ? 
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
            message: 'Error al obtener la editorial' 
        });
    }
};

// POST /api/editoriales - Crear una nueva editorial
exports.crear = async function(req, res, next) {
    const { nombre, pais } = req.body;

    // Validaciones
    if (!nombre) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'El nombre de la editorial es requerido' 
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
        const sql = "INSERT INTO Editorial (nombre, pais) VALUES (?, ?)";
        const [result] = await db.query(sql, [
            nombre.trim(),
            pais ? pais.trim() : null
        ]);

        res.status(201).json({ 
            status: 'ok',
            message: 'Editorial creada exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al crear la editorial' 
        });
    }
};

// PUT /api/editoriales/:id - Actualizar una editorial
exports.actualizar = async function(req, res, next) {
    const { id } = req.params;
    const { nombre, pais } = req.body;

    if (!nombre && pais === undefined) {
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

    if (pais !== undefined) {
        updates.push("pais = ?");
        params.push(pais ? pais.trim() : null);
    }

    const sql = `UPDATE Editorial SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    try {
        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Editorial no encontrada',
                message: 'No existe una editorial con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Editorial actualizada exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al actualizar la editorial' 
        });
    }
};

// DELETE /api/editoriales/:id - Eliminar una editorial
exports.eliminar = async function(req, res, next) {
    const { id } = req.params;

    try {
        // Verificar si tiene libros asociados
        const [libros] = await db.query("SELECT COUNT(*) as total FROM Libro WHERE editorial_id = ?", [id]);
        
        if (libros[0].total > 0) {
            return res.status(409).json({ 
                error: 'No se puede eliminar',
                message: `La editorial tiene ${libros[0].total} libro(s) asociado(s). Elimínelos primero o asígneles otra editorial.` 
            });
        }

        const sql = "DELETE FROM Editorial WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Editorial no encontrada',
                message: 'No existe una editorial con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Editorial eliminada exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar la editorial' 
        });
    }
};