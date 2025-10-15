const router = require('express').Router();
const { hashPass, verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');

// NOTA: Este router ya recibe verificarToken aplicado desde main.js
// Por lo tanto, req.usuario siempre estará disponible

// GET /api/usuarios/perfil - Obtener perfil del usuario autenticado
router.get('/', function(req, res, next) {
    const userId = req.usuario.id;
    
    let sql = `SELECT id, nombre, nombre_usuario, correo, biografia, url_avatar, rol, fecha_creacion 
               FROM Usuario WHERE id = ?`;
    
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

// PUT /api/usuarios/perfil/actualizar - Actualizar datos del perfil
router.put('/actualizar', function(req, res, next) {
    const { nombre, nombre_usuario, correo, biografia, url_avatar } = req.body;
    const userId = req.usuario.id;
    
    if (!nombre && !nombre_usuario && !correo && !biografia && !url_avatar) {
        return res.status(400).json({ 
            error: 'Debe proporcionar al menos un campo para actualizar' 
        });
    }
    
    const updates = [];
    const params = [];
    
    if (nombre) {
        updates.push("nombre = ?");
        params.push(nombre.trim());
    }
    
    if (nombre_usuario) {
        // Validar formato de usuario
        const userRegex = /^[a-zA-Z0-9_]+$/;
        if (!userRegex.test(nombre_usuario.trim())) {
            return res.status(400).json({ 
                error: 'Usuario inválido',
                message: 'El usuario solo puede contener letras, números y guiones bajos' 
            });
        }
        updates.push("nombre_usuario = ?");
        params.push(nombre_usuario.trim());
    }
    
    if (correo) {
        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            return res.status(400).json({ 
                error: 'Correo inválido',
                message: 'El formato del correo no es válido' 
            });
        }
        updates.push("correo = ?");
        params.push(correo.trim());
    }
    
    if (biografia !== undefined) {
        updates.push("biografia = ?");
        params.push(biografia ? biografia.trim() : null);
    }
    
    if (url_avatar !== undefined) {
        updates.push("url_avatar = ?");
        params.push(url_avatar ? url_avatar.trim() : null);
    }
    
    const sql = `UPDATE Usuario SET ${updates.join(", ")} WHERE id = ?`;
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
                    error: 'Datos duplicados',
                    message: 'El nombre de usuario o correo ya existe' 
                });
            }
            res.status(500).json({ 
                error: 'Error al actualizar perfil' 
            });
        });
});

// PUT /api/usuarios/perfil/cambiar-password - Cambiar contraseña
router.put('/cambiar-password', function(req, res, next) {
    const { contrasenaActual, contrasenaNueva } = req.body;
    const userId = req.usuario.id;
    
    if (!contrasenaActual || !contrasenaNueva) {
        return res.status(400).json({ 
            error: 'Contraseña actual y nueva son requeridas' 
        });
    }

    if (contrasenaNueva.length < 6) {
        return res.status(400).json({ 
            error: 'Contraseña débil',
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }
    
    // Verificar contraseña actual
    let sqlSelect = "SELECT contrasena_hash FROM Usuario WHERE id = ?";
    
    db.query(sqlSelect, [userId])
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }
            
            const usuario = rows[0];
            
            if (!verificarPass(contrasenaActual, usuario.contrasena_hash)) {
                return res.status(401).json({ 
                    error: 'Contraseña actual incorrecta' 
                });
            }
            
            // Actualizar con nueva contraseña hasheada
            const contrasenaHash = hashPass(contrasenaNueva);
            let sqlUpdate = "UPDATE Usuario SET contrasena_hash = ? WHERE id = ?";
            
            return db.query(sqlUpdate, [contrasenaHash, userId]);
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