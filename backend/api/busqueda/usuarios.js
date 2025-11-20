const router = require('express').Router();
const db = require('../../conexion');

// GET /api/busqueda/usuarios?q=termino&rol=admin
router.get('/', async function(req, res, next) {
    const { q, rol } = req.query;

    if (!q || q.trim().length < 2) {
        return res.status(400).json({
            error: 'Búsqueda inválida',
            message: 'Debe proporcionar al menos 2 caracteres para buscar'
        });
    }

    try {
        let sql = `
            SELECT 
                u.id,
                u.nombre_usuario,
                u.url_avatar
            FROM Usuario u
            WHERE (u.nombre LIKE ? OR u.nombre_usuario LIKE ?)
        `;
        
        const params = [];
        const terminoBusqueda = `%${q.trim()}%`;
        params.push(terminoBusqueda, terminoBusqueda);

        // Filtro por rol
        if (rol && ['admin', 'usuario'].includes(rol.toLowerCase())) {
            sql += ` AND u.rol = ?`;
            params.push(rol.toLowerCase());
        }

        sql += ` ORDER BY u.nombre_usuario ASC LIMIT 20`;

        const [usuarios] = await db.query(sql, params);

        res.json({
            status: 'ok',
            usuarios: usuarios
        });

    } catch (error) {
        console.error('Error en búsqueda de usuarios:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al buscar usuarios'
        });
    }
});

module.exports = router;