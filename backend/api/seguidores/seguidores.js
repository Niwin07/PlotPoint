const router = require('express').Router();
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');

router.post('/', verificarToken, async (req, res) => {
    const { seguido_id } = req.body;
    const seguidor_id = req.usuario.id;

    if (!seguido_id) {
        return res.status(400).json({
            error: 'Datos incompletos',
            message: 'El ID del usuario a seguir es requerido'
        });
    }

    if (seguidor_id == seguido_id) {
        return res.status(400).json({
            error: 'Acción no permitida',
            message: 'No puedes seguirte a ti mismo'
        });
    }

    try {
        // validar si el usuario existe
        const [usuario] = await db.query("SELECT id FROM Usuario WHERE id = ?", [seguido_id]);
        if (usuario.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario que intentas seguir no existe'
            });
        }

        // insertar seguidor
        const sql = "INSERT INTO Seguidores (seguidor_id, seguido_id) VALUES (?, ?)";
        await db.query(sql, [seguidor_id, seguido_id]);

        res.status(201).json({
            status: 'ok',
            message: 'Usuario seguido exitosamente'
        });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: 'Ya sigues a este usuario',
                message: 'Ya estás siguiendo a este usuario'
            });
        }

        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al intentar seguir al usuario'
        });
    }
});


router.delete('/:seguido_id', verificarToken, async (req, res) => {
    const { seguido_id } = req.params;
    const seguidor_id = req.usuario.id;

    try {
        const sql = "DELETE FROM Seguidores WHERE seguidor_id = ? AND seguido_id = ?";
        const [result] = await db.query(sql, [seguidor_id, seguido_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'No encontrado',
                message: 'No estabas siguiendo a este usuario'
            });
        }

        res.json({
            status: 'ok',
            message: 'Dejaste de seguir al usuario'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al dejar de seguir al usuario'
        });
    }
});


router.get('/check/:usuario_id', verificarToken, async (req, res) => {
    const { usuario_id } = req.params;
    const seguidor_id = req.usuario.id;

    try {
        const sql = "SELECT 1 FROM Seguidores WHERE seguidor_id = ? AND seguido_id = ?";
        const [rows] = await db.query(sql, [seguidor_id, usuario_id]);

        res.json({
            siguiendo: rows.length > 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al verificar el seguimiento'
        });
    }
});


router.get('/:usuario_id/seguidores', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const sql = `
            SELECT 
                u.id,
                u.nombre_usuario,
                u.nombre,
                u.url_avatar
            FROM Usuario u
            INNER JOIN Seguidores s ON u.id = s.seguidor_id
            WHERE s.seguido_id = ?
            ORDER BY s.fecha_creacion DESC
        `;
        const [seguidores] = await db.query(sql, [usuario_id]);

        res.json({
            status: 'ok',
            usuario_id,
            seguidores,
            total: seguidores.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener seguidores'
        });
    }
});


router.get('/:usuario_id/seguidos', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const sql = `
            SELECT 
                u.id,
                u.nombre_usuario,
                u.nombre,
                u.url_avatar
            FROM Usuario u
            INNER JOIN Seguidores s ON u.id = s.seguido_id
            WHERE s.seguidor_id = ?
            ORDER BY s.fecha_creacion DESC
        `;
        const [seguidos] = await db.query(sql, [usuario_id]);

        res.json({
            status: 'ok',
            usuario_id,
            seguidos,
            total: seguidos.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener seguidos'
        });
    }
});


module.exports = router;
