const router = require('express').Router();
const db = require('../../conexion');
const { hashPass } = require('@damianegreco/hashpass');
const verificarAdmin = require('../middlewares/admin');

// Todas las rutas requieren rol de administrador
router.use(verificarAdmin);

// GET /api/usuarios/admin - Listar todos los usuarios (con búsqueda opcional)
router.get('/', async function (req, res, next) {
    const { busqueda } = req.query;

    let sql = `SELECT id, nombre, nombre_usuario, correo, biografia, url_avatar, rol, fecha_creacion 
               FROM Usuario`;
    let params = [];
    
    if (busqueda) {
        sql += " WHERE nombre_usuario LIKE ? OR nombre LIKE ? OR correo LIKE ?";
        const busquedaParcial = `%${busqueda}%`;
        params = [busquedaParcial, busquedaParcial, busquedaParcial];
    }

    try {
        const [rows] = await db.query(sql, params);
        res.json({ status: 'ok', usuarios: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error en la consulta' 
        });
    }
});

// PUT /api/usuarios/admin/:user_id - Actualizar cualquier usuario
router.put('/:user_id', async function (req, res, next) {
    const { nombre, nombre_usuario, correo, contrasena, biografia, url_avatar, rol } = req.body;
    const { user_id } = req.params;

    if (!nombre && !nombre_usuario && !correo && !contrasena && !biografia && !url_avatar && !rol) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Debe proporcionar al menos un campo para actualizar' 
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
    
    if (contrasena) {
        // Hashear con @damianegreco/hashpass
        updates.push("contrasena_hash = ?");
        params.push(hashPass(contrasena));
    }
    
    if (biografia !== undefined) {
        updates.push("biografia = ?");
        params.push(biografia ? biografia.trim() : null);
    }
    
    if (url_avatar !== undefined) {
        updates.push("url_avatar = ?");
        params.push(url_avatar ? url_avatar.trim() : null);
    }
    
    if (rol && ['admin', 'usuario'].includes(rol)) {
        updates.push("rol = ?");
        params.push(rol);
    }

    const sql = `UPDATE Usuario SET ${updates.join(", ")} WHERE id = ?`;
    params.push(user_id);

    try {
        const [result] = await db.query(sql, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID' 
            });
        }
        
        res.json({ 
            status: 'ok',
            message: 'Usuario actualizado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                error: 'Datos duplicados',
                message: 'El nombre de usuario o correo ya existe' 
            });
        }
        
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al actualizar usuario' 
        });
    }
});

// DELETE /api/usuarios/admin/:user_id - Eliminar un usuario
router.delete('/:user_id', async function (req, res, next) {
    const { user_id } = req.params;
    
    // Prevenir que el admin se elimine a sí mismo
    if (req.usuario.id == user_id) {
        return res.status(400).json({ 
            error: 'Operación no permitida',
            message: 'No puedes eliminar tu propia cuenta' 
        });
    }
    
    const sql = "DELETE FROM Usuario WHERE id = ?";
    
    try {
        const [result] = await db.query(sql, [user_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: 'No existe un usuario con ese ID' 
            });
        }
        
        res.json({ 
            status: 'ok',
            message: 'Usuario eliminado exitosamente' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al eliminar usuario' 
        });
    }
});

module.exports = router;