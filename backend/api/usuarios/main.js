// ============================================
// backend/api/usuarios/main.js (REGISTRO MEJORADO)
// ============================================
const router = require('express').Router();
const db = require('../../conexion');
const { hashPass } = require('@damianegreco/hashpass');

const loginRouter = require('./login');
const perfilRouter = require('./perfil');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// ========== RUTAS PÚBLICAS ==========
router.use("/login", loginRouter);

// Registro público de usuario (MEJORADO)
router.post('/registro', async function (req, res, next) {
    const { nombre, user, pass } = req.body;

    // Validaciones básicas
    if (!nombre || !user || !pass) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Nombre, usuario y contraseña son requeridos' 
        });
    }

    // Validaciones de tipo
    if (typeof nombre !== 'string' || typeof user !== 'string' || typeof pass !== 'string') {
        return res.status(400).json({ 
            error: 'Datos inválidos',
            message: 'Todos los campos deben ser texto' 
        });
    }

    // Validaciones de longitud
    if (nombre.trim().length < 2) {
        return res.status(400).json({ 
            error: 'Nombre inválido',
            message: 'El nombre debe tener al menos 2 caracteres' 
        });
    }

    if (user.trim().length < 3) {
        return res.status(400).json({ 
            error: 'Usuario inválido',
            message: 'El usuario debe tener al menos 3 caracteres' 
        });
    }

    if (pass.length < 6) {
        return res.status(400).json({ 
            error: 'Contraseña débil',
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }

    // Validar formato de usuario (solo letras, números y guiones bajos)
    const userRegex = /^[a-zA-Z0-9_]+$/;
    if (!userRegex.test(user.trim())) {
        return res.status(400).json({ 
            error: 'Usuario inválido',
            message: 'El usuario solo puede contener letras, números y guiones bajos' 
        });
    }

    try {
        // Hashear contraseña con @damianegreco/hashpass
        const passHash = hashPass(pass);

        const sql = "INSERT INTO users (nombre, user, pass, rol) VALUES (?, ?, ?, 'usuario')";
        
        await db.query(sql, [nombre.trim(), user.trim(), passHash]);
        
        res.status(201).json({ 
            status: 'ok',
            message: 'Usuario registrado exitosamente' 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                error: 'Usuario duplicado',
                message: 'El nombre de usuario ya existe' 
            });
        }
        
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al registrar usuario' 
        });
    }
});

// ========== RUTAS DE PERFIL ==========
router.use('/perfil', perfilRouter);

// ========== RUTAS DE ADMINISTRADOR ==========
// Las demás rutas se mantienen igual...
router.get('/', verificarToken, verificarAdmin, async function (req, res, next) {
    const { busqueda } = req.query;

    let sql = "SELECT id, nombre, user, rol FROM users";
    let params = [];
    
    if (busqueda) {
        sql += " WHERE user LIKE ? OR nombre LIKE ?";
        const busquedaParcial = `%${busqueda}%`;
        params = [busquedaParcial, busquedaParcial];
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

router.put('/:user_id', verificarToken, verificarAdmin, async function (req, res, next) {
    const { nombre, user, pass, rol } = req.body;
    const { user_id } = req.params;

    if (!nombre && !user && !pass && !rol) {
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
    if (user) {
        updates.push("user = ?");
        params.push(user.trim());
    }
    if (pass) {
        // Hashear con @damianegreco/hashpass
        updates.push("pass = ?");
        params.push(hashPass(pass));
    }
    if (rol && ['admin', 'usuario'].includes(rol)) {
        updates.push("rol = ?");
        params.push(rol);
    }

    const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
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
                error: 'Usuario duplicado',
                message: 'El nombre de usuario ya existe' 
            });
        }
        
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Error al actualizar usuario' 
        });
    }
});

router.delete('/:user_id', verificarToken, verificarAdmin, async function (req, res, next) {
    const { user_id } = req.params;
    
    if (req.usuario.id == user_id) {
        return res.status(400).json({ 
            error: 'Operación no permitida',
            message: 'No puedes eliminar tu propia cuenta' 
        });
    }
    
    const sql = "DELETE FROM users WHERE id = ?";
    
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