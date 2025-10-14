// ============================================
// backend/api/usuarios/perfil.js (REFACTORIZADO)
// Gestión del perfil del usuario autenticado
// ============================================
const router = require('express').Router();
const { hashPass, verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');

// NOTA: Este router ya recibe verificarToken aplicado desde main.js
// Por lo tanto, req.usuario siempre estará disponible

// GET /api/usuarios/perfil - Obtener perfil del usuario autenticado
router.get('/', function(req, res, next) {
    const userId = req.usuario.id;
    
    let sql = "SELECT id, nombre, user, rol FROM users WHERE id = ?";
    
    db.query(sql, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            res.json(rows[0]);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ 
                error: 'Error al obtener perfil' 
            });
        });
});

// PUT /api/usuarios/perfil/actualizar - Actualizar nombre y/o usuario
router.put('/actualizar', function(req, res, next) {
    const { nombre, user } = req.body;
    const userId = req.usuario.id;
    
    if (!nombre && !user) {
        return res.status(400).json({ 
            error: 'Debe proporcionar al menos un campo para actualizar' 
        });
    }
    
    let sql = "UPDATE users SET ";
    const params = [];
    
    if (nombre) {
        sql += "nombre = ?";
        params.push(nombre.trim());
    }
    
    if (user) {
        if (nombre) sql += ", ";
        sql += "user = ?";
        params.push(user.trim());
    }
    
    sql += " WHERE id = ?";
    params.push(userId);
    
    db.query(sql, params)
        .then(() => {
            res.json({ 
                status: 'ok',
                message: 'Perfil actualizado exitosamente' 
            });
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ 
                    error: 'El nombre de usuario ya existe' 
                });
            }
            res.status(500).json({ 
                error: 'Error al actualizar perfil' 
            });
        });
});

// PUT /api/usuarios/perfil/cambiar-password - Cambiar contraseña
router.put('/cambiar-password', function(req, res, next) {
    const { passwordActual, passwordNueva } = req.body;
    const userId = req.usuario.id;
    
    if (!passwordActual || !passwordNueva) {
        return res.status(400).json({ 
            error: 'Contraseña actual y nueva son requeridas' 
        });
    }

    if (passwordNueva.length < 6) {
        return res.status(400).json({ 
            error: 'Contraseña débil',
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }
    
    // Verificar contraseña actual
    let sqlSelect = "SELECT pass FROM users WHERE id = ?";
    
    db.query(sqlSelect, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            const usuario = rows[0];
            
            if (!verificarPass(passwordActual, usuario.pass)) {
                return res.status(401).json({ 
                    error: 'Contraseña actual incorrecta' 
                });
            }
            
            // Actualizar con nueva contraseña hasheada
            const passHash = hashPass(passwordNueva);
            let sqlUpdate = "UPDATE users SET pass = ? WHERE id = ?";
            
            return db.query(sqlUpdate, [passHash, userId]);
        })
        .then(() => {
            res.json({ 
                status: 'ok',
                message: 'Contraseña actualizada exitosamente' 
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ 
                error: 'Error al cambiar contraseña' 
            });
        });
});

module.exports = router;