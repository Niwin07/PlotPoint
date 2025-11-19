const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

router.get('/', async (req, res) => {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, descripcion FROM Genero";
    let params = [];
    
    if (busqueda) {
        sql += " WHERE nombre LIKE ? OR descripcion LIKE ?";
        const b = `%${busqueda}%`;
        params = [b, b];
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
});

router.get('/:id', async (req, res) => {
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
});

router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'El nombre del género es requerido' 
        });
    }

    if (nombre.trim().length < 2) {
        return res.status(400).json({ 
            error: 'Nombre inválido',
            message: 'Debe tener al menos 2 caracteres' 
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
});

router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    if (!nombre && descripcion === undefined) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Debe proporcionar algún campo' 
        });
    }

    const updates = [];
    const params = [];

    if (nombre) {
        if (nombre.trim().length < 2) {
            return res.status(400).json({ 
                error: 'Nombre inválido',
                message: 'Debe tener al menos 2 caracteres' 
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
});

router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const [libros] = await db.query(
            "SELECT COUNT(*) as total FROM LibroGenero WHERE genero_id = ?", [id]
        );
        
        if (libros[0].total > 0) {
            return res.status(409).json({ 
                error: 'No se puede eliminar',
                message: `El género tiene ${libros[0].total} libro(s) asociado(s)` 
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
});

module.exports = router;
