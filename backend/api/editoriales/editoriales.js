const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

router.get('/', async (req, res) => {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, pais FROM Editorial";
    let params = [];

    if (busqueda) {
        sql += " WHERE nombre LIKE ? OR pais LIKE ?";
        const like = `%${busqueda}%`;
        params = [like, like];
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
});

router.get('/:id', async (req, res) => {
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

        const sqlLibros = `
            SELECT id, titulo, anio_publicacion
            FROM Libro
            WHERE editorial_id = ?
            ORDER BY anio_publicacion DESC
        `;
        const [libros] = await db.query(sqlLibros, [id]);

        res.json({
            ...rows[0],
            libros
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener la editorial'
        });
    }
});

router.post('/', verificarToken, verificarAdmin, async (req, res) => {
    const { nombre, pais } = req.body;

    if (!nombre) {
        return res.status(400).json({
            error: 'Datos incompletos',
            message: 'El nombre de la editorial es requerido'
        });
    }

    if (nombre.trim().length < 2) {
        return res.status(400).json({
            error: 'Nombre inválido',
            message: 'Debe tener al menos 2 caracteres'
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
});
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
    const { id } = req.params;
    const { nombre, pais } = req.body;

    if (!nombre && pais === undefined) {
        return res.status(400).json({
            error: 'Datos incompletos',
            message: 'Debe proporcionar campos para actualizar'
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
});

router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const [libros] = await db.query(
            "SELECT COUNT(*) as total FROM Libro WHERE editorial_id = ?", 
            [id]
        );

        if (libros[0].total > 0) {
            return res.status(409).json({
                error: 'No se puede eliminar',
                message: `La editorial tiene ${libros[0].total} libro(s) asociado(s)`
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
});

module.exports = router;
