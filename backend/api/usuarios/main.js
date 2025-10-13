// api/usuarios/main.js
const router = require('express').Router();
const db = require('../../conexion');
const { hashPass } = require('@damianegreco/hashpass');

const loginRouter = require('./login');
const perfilRouter = require('./perfil');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// ========== RUTAS PÚBLICAS ==========
router.use("/login", loginRouter);

// Registro público de usuario
router.post('/registro', function (req, res, next) {
    const { nombre, user, pass } = req.body;

    // Validación
    if (!nombre || !user || !pass) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    let sql = "INSERT INTO users (nombre, user, pass, rol)";
    sql += " VALUES (?, ?, ?, 'usuario')"; // Rol por defecto

    const passHash = hashPass(pass);

    db.query(sql, [nombre, user, passHash])
        .then(() => {
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El nombre de usuario ya existe' });
            }
            res.status(500).json({ error: 'Error al registrar usuario' });
        });
});

// ========== RUTAS DE PERFIL (requieren autenticación) ==========
router.use('/perfil', perfilRouter);

// ========== RUTAS DE ADMINISTRADOR ==========
// Búsqueda de usuarios (solo admin)
router.get('/', verificarToken, verificarAdmin, function (req, res, next) {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, user, rol FROM users"; // NO incluir pass
    let params = [];
    
    if (busqueda) {
        sql += " WHERE user LIKE ? OR nombre LIKE ?";
        const busquedaParcial = `%${busqueda}%`;
        params = [busquedaParcial, busquedaParcial];
    }

    db.query(sql, params)
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error en la consulta' });
        });
});

// Editar cualquier usuario (solo admin)
router.put('/:user_id', verificarToken, verificarAdmin, function (req, res, next) {
    const { nombre, user, pass, rol } = req.body;
    const { user_id } = req.params;

    if (!nombre && !user && !pass && !rol) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }

    let sql = "UPDATE users SET ";
    const params = [];
    const updates = [];

    if (nombre) {
        updates.push("nombre = ?");
        params.push(nombre);
    }
    if (user) {
        updates.push("user = ?");
        params.push(user);
    }
    if (pass) {
        updates.push("pass = ?");
        params.push(hashPass(pass)); // Hashear contraseña
    }
    if (rol) {
        updates.push("rol = ?");
        params.push(rol);
    }

    sql += updates.join(", ");
    sql += " WHERE id = ?";
    params.push(user_id);

    db.query(sql, params)
        .then(() => {
            res.json({ message: 'Usuario actualizado exitosamente' });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El nombre de usuario ya existe' });
            }
            res.status(500).json({ error: 'Error al actualizar usuario' });
        });
});

// Eliminar usuario (solo admin)
router.delete('/:user_id', verificarToken, verificarAdmin, function (req, res, next) {
    const { user_id } = req.params;
    
    // Evitar que el admin se elimine a sí mismo
    if (req.usuario.id == user_id) {
        return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }
    
    const sql = "DELETE FROM users WHERE id = ?";
    
    db.query(sql, [user_id])
        .then(([result]) => {
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario eliminado exitosamente' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar usuario' });
        });
});

module.exports = router;