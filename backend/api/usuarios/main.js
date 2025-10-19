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
    const { nombre, nombre_usuario, correo, contrasena, biografia, url_avatar } = req.body;

    // Validaciones básicas
    if (!nombre || !nombre_usuario || !correo || !contrasena) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Nombre, usuario, correo y contraseña son requeridos' 
        });
    }

    // Validaciones de tipo
    if (typeof nombre !== 'string' || typeof nombre_usuario !== 'string' || 
        typeof correo !== 'string' || typeof contrasena !== 'string') {
        return res.status(400).json({ 
            error: 'Datos inválidos',
            message: 'Todos los campos obligatorios deben ser texto' 
        });
    }

    // Validaciones de longitud
    if (nombre.trim().length < 2) {
        return res.status(400).json({ 
            error: 'Nombre inválido',
            message: 'El nombre debe tener al menos 2 caracteres' 
        });
    }

    if (nombre_usuario.trim().length < 3) {
        return res.status(400).json({ 
            error: 'Usuario inválido',
            message: 'El usuario debe tener al menos 3 caracteres' 
        });
    }

    if (contrasena.length < 6) {
        return res.status(400).json({ 
            error: 'Contraseña débil',
            message: 'La contraseña debe tener al menos 6 caracteres' 
        });
    }

    // Validar formato de usuario (solo letras, números y guiones bajos)
    const userRegex = /^[a-zA-Z0-9_]+$/;
    if (!userRegex.test(nombre_usuario.trim())) {
        return res.status(400).json({ 
            error: 'Usuario inválido',
            message: 'El usuario solo puede contener letras, números y guiones bajos' 
        });
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
        return res.status(400).json({ 
            error: 'Correo inválido',
            message: 'El formato del correo no es válido' 
        });
    }

    try {
        // Hashear contraseña con @damianegreco/hashpass
        const contrasenaHash = hashPass(contrasena);
        
        // Avatar por defecto si no se proporciona
        const avatarFinal = url_avatar || '/uploads/avatars/default.png';

        const sql = `INSERT INTO Usuario 
                     (nombre, nombre_usuario, correo, contrasena_hash, biografia, url_avatar, rol) 
                     VALUES (?, ?, ?, ?, ?, ?, 'usuario')`;
        
        await db.query(sql, [
            nombre.trim(), 
            nombre_usuario.trim(), 
            correo.trim(), 
            contrasenaHash,
            biografia ? biografia.trim() : null,
            avatarFinal
        ]);
        
        res.status(201).json({ 
            status: 'ok',
            message: 'Usuario registrado exitosamente' 
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                error: 'Datos duplicados',
                message: 'El nombre de usuario o correo ya existe' 
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