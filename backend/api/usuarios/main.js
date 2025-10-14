// ============================================
// backend/api/usuarios/main.js (REFACTORIZADO)
// ============================================
const router = require('express').Router();
const db = require('../../conexion');
const { hashPass } = require('@damianegreco/hashpass');

const loginRouter = require('./login');
const perfilRouter = require('./perfil');
const adminRouter = require('./admin');
const verificarToken = require('../middlewares/auth');

// ========== RUTAS PÚBLICAS ==========
router.use("/login", loginRouter);

// Registro público de usuario
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

// ========== RUTAS PROTEGIDAS ==========
router.use('/perfil', verificarToken, perfilRouter);
router.use('/admin', verificarToken, adminRouter);

module.exports = router;