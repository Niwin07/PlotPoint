const db = require('../../conexion');

// GET /api/generos - Listar todos los géneros
exports.listar = async function(req, res, next) {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, descripcion FROM Genero";
    let params = [];
    
    if (busqueda) {
        sql += " WHERE nombre LIKE ? OR descripcion LIKE ?";
        const busquedaParcial = `%${busqueda}%`;
        params = [busquedaParcial, busquedaParcial];
    }

    sql += " ORDER BY nombre";

    try {
        const [rows] = await db.query(sql, params);
        res.json({ 
            status: 'ok', 
            generos: rows,
            total: rows.length 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al obtener géneros' 
        });
    }
};

// GET /api/generos/:id - Obtener un género específico
exports.obtener = async function(req, res, next) {
    const { id } = req.params;

    try {
        const sql = "SELECT id, nombre, descripcion FROM Genero WHERE id = ?";
        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ 
                error: 'Género no encontrado',
                message: 'No existe un género con ese ID' 
            });
        }

        // Obtener libros del género
        const sqlLibros = `
            SELECT l.id, l.titulo, l.anio_publicacion 
            FROM Libro l
            INNER JOIN LibroGenero lg ON l.id = lg.libro_id
            WHERE lg.genero_id = ? 
            ORDER BY l.anio_publicacion DESC
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
            message: 'Error al obtener el género' 
        });
    }
};

// POST /api/generos - Crear un nuevo género
exports.crear = async function(req, res, next) {
    const { nombre, descripcion } = req.body;

    // Validaciones
    if (!nombre) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'El nombre del género es requerido' 
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
        const sql = "INSERT INTO Genero (nombre, descripcion) VALUES (?, ?)";
        const [result] = await db.query(sql, [
            nombre.trim(),
            descripcion ? descripcion.trim() : null
        ]);

        res.status(201).json({ 
            status: 'ok',
            message: 'Género creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al crear el género' 
        });
    }
};

// PUT /api/generos/:id - Actualizar un género
exports.actualizar = async function(req, res, next) {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre && descripcion === undefined) {
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

    if (descripcion !== undefined) {
        updates.push("descripcion = ?");
        params.push(descripcion ? descripcion.trim() : null);
    }

    const sql = `UPDATE Genero SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    try {
        const [result] = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Género no encontrado',
                message: 'No existe un género con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Género actualizado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al actualizar el género' 
        });
    }
};

// DELETE /api/generos/:id - Eliminar un género
exports.eliminar = async function(req, res, next) {
    const { id } = req.params;

    try {
        // Verificar si tiene libros asociados
        const [libros] = await db.query("SELECT COUNT(*) as total FROM LibroGenero WHERE genero_id = ?", [id]);
        
        if (libros[0].total > 0) {
            return res.status(409).json({ 
                error: 'No se puede eliminar',
                message: `El género tiene ${libros[0].total} libro(s) asociado(s). Elimine esas relaciones primero.` 
            });
        }

        const sql = "DELETE FROM Genero WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Género no encontrado',
                message: 'No existe un género con ese ID' 
            });
        }

        res.json({ 
            status: 'ok',
            message: 'Género eliminado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar el género' 
        });
    }
};