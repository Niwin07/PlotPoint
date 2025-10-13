// api/usuarios/perfil.js
const router = require('express').Router();
const { hashPass, verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');
const verificarToken = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener perfil del usuario autenticado
router.get('/', function(req, res, next) {
    const userId = req.usuario.id;
    
    let sql = "SELECT id, nombre, user, rol FROM users WHERE id = ?";
    
    db.query(sql, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(rows[0]);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener perfil' });
        });
});

// Actualizar nombre de usuario (sin contraseña)
router.put('/actualizar', function(req, res, next) {
    const { nombre, user } = req.body;
    const userId = req.usuario.id;
    
    if (!nombre && !user) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
    }
    
    let sql = "UPDATE users SET ";
    const params = [];
    
    if (nombre) {
        sql += "nombre = ?";
        params.push(nombre);
    }
    
    if (user) {
        if (nombre) sql += ", ";
        sql += "user = ?";
        params.push(user);
    }
    
    sql += " WHERE id = ?";
    params.push(userId);
    
    db.query(sql, params)
        .then(() => {
            res.json({ message: 'Perfil actualizado exitosamente' });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El nombre de usuario ya existe' });
            }
            res.status(500).json({ error: 'Error al actualizar perfil' });
        });
});

// Cambiar contraseña
router.put('/cambiar-password', function(req, res, next) {
    const { passwordActual, passwordNueva } = req.body;
    const userId = req.usuario.id;
    
    if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    }
    
    // Verificar contraseña actual
    let sqlSelect = "SELECT pass FROM users WHERE id = ?";
    
    db.query(sqlSelect, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            const usuario = rows[0];
            
            if (!verificarPass(passwordActual, usuario.pass)) {
                return res.status(401).json({ error: 'Contraseña actual incorrecta' });
            }
            
            // Actualizar con nueva contraseña hasheada
            const passHash = hashPass(passwordNueva);
            let sqlUpdate = "UPDATE users SET pass = ? WHERE id = ?";
            
            return db.query(sqlUpdate, [passHash, userId]);
        })
        .then(() => {
            res.json({ message: 'Contraseña actualizada exitosamente' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error al cambiar contraseña' });
        });
});

module.exports = router;