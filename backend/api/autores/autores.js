const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

router.get('/', async (req, res) => {
    const { busqueda } = req.query;

    let sql = `
        SELECT 
            a.id, 
            a.nombre, 
            a.apellido, 
            a.nacionalidad,
            COUNT(l.id) as libros
        FROM Autor a
        LEFT JOIN Libro l ON a.id = l.autor_id
    `;

    let params = [];

    if (busqueda) {
        sql += " WHERE a.nombre LIKE ? OR a.apellido LIKE ? OR a.nacionalidad LIKE ?";
        const b = `%${busqueda}%`;
        params = [b, b, b];
    }

    sql += `
        GROUP BY a.id, a.nombre, a.apellido, a.nacionalidad
        ORDER BY a.apellido, a.nombre
    `;

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
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `
            SELECT 
                a.id, 
                a.nombre, 
                a.apellido, 
                a.nacionalidad,
                COUNT(l.id) as libros
            FROM Autor a
            LEFT JOIN Libro l ON a.id = l.autor_id
            WHERE a.id = ?
            GROUP BY a.id, a.nombre, a.apellido, a.nacionalidad
        `;

        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Autor no encontrado',
                message: 'No existe un autor con ese ID'
            });
        }

        const sqlLibros = `
            SELECT id, titulo, anio_publicacion
            FROM Libro
            WHERE autor_id = ?
            ORDER BY anio_publicacion DESC
        `;

        const [libros] = await db.query(sqlLibros, [id]);

        res.json({
            status: 'ok',
            autor: {
                ...rows[0],
                detalleLibros: libros
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener el autor'
        });
    }
});

router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    const { nombre, apellido, nacionalidad } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
        return res.status(400).json({
            error: 'Nombre inválido',
            message: 'El nombre es requerido y debe tener al menos 2 caracteres'
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
});

router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, nacionalidad } = req.body;

    if (!nombre && !apellido && nacionalidad === undefined) {
        return res.status(400).json({
            error: 'Datos incompletos',
            message: 'Debe enviar al menos un campo'
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
});


router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const [libros] = await db.query(
            "SELECT COUNT(*) as total FROM Libro WHERE autor_id = ?", 
            [id]
        );

        if (libros[0].total > 0) {
            return res.status(409).json({
                error: 'No se puede eliminar',
                message: `El autor tiene ${libros[0].total} libro(s) asociado(s)`
            });
        }

        const [result] = await db.query("DELETE FROM Autor WHERE id = ?", [id]);

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
});

module.exports = router;
