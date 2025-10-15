const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_segura';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

router.post('/', async function(req, res, next) {
    const { nombre_usuario, contrasena } = req.body;

    // Validación de entrada
    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Usuario y contraseña son requeridos' 
        });
    }

    // Validación adicional
    if (typeof nombre_usuario !== 'string' || typeof contrasena !== 'string') {
        return res.status(400).json({ 
            error: 'Datos inválidos',
            message: 'Usuario y contraseña deben ser texto' 
        });
    }

    if (nombre_usuario.trim().length < 3) {
        return res.status(400).json({ 
            error: 'Usuario inválido',
            message: 'El usuario debe tener al menos 3 caracteres' 
        });
    }

    try {
        const sql = "SELECT id, nombre_usuario, contrasena_hash, rol, nombre, correo FROM Usuario WHERE nombre_usuario = ?";
        const [usuarios] = await db.query(sql, [nombre_usuario.trim()]);

        if (!usuarios || usuarios.length === 0) {
            return res.status(401).json({ 
                error: 'Credenciales incorrectas',
                message: 'Usuario y/o contraseña incorrectos' 
            });
        }

        const usuario = usuarios[0];
        
        // Verificar contraseña con hashpass
        const passwordValida = verificarPass(contrasena, usuario.contrasena_hash);
        
        if (!passwordValida) {
            return res.status(401).json({ 
                error: 'Credenciales incorrectas',
                message: 'Usuario y/o contraseña incorrectos' 
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                nombre_usuario: usuario.nombre_usuario,
                rol: usuario.rol || 'usuario'
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        res.status(200).json({
            status: "ok",
            message: "Inicio de sesión exitoso",
            token: token,
            usuario: {
                id: usuario.id,
                nombre_usuario: usuario.nombre_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            error: 'Error del servidor',
            message: 'Ocurrió un error al procesar la solicitud' 
        });
    }
});

module.exports = router;