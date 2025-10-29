const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_segura';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '6h';

router.post('/', async function(req, res) {
    let { nombre_usuario, contrasena } = req.body;

    // Validación básica
    if (!nombre_usuario || !contrasena) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Usuario/Email y contraseña son requeridos' 
        });
    }

    if (typeof nombre_usuario !== 'string' || typeof contrasena !== 'string') {
        return res.status(400).json({ 
            error: 'Datos inválidos',
            message: 'Usuario/Email y contraseña deben ser texto' 
        });
    }

    try {
        // email o nombre_usuario
        const esEmail = nombre_usuario.includes('@');

        const sql = `
            SELECT id, nombre_usuario, contrasena_hash, rol, nombre, correo 
            FROM Usuario 
            WHERE ${esEmail ? 'correo = ?' : 'nombre_usuario = ?'}
        `;

        const [usuarios] = await db.query(sql, [nombre_usuario.trim()]);

        if (!usuarios || usuarios.length === 0) {
            return res.status(401).json({ 
                error: 'Credenciales incorrectas',
                message: 'Usuario/Email y/o contraseña incorrectos' 
            });
        }

        const usuario = usuarios[0];

        // Validar contraseña
        const passwordValida = verificarPass(contrasena, usuario.contrasena_hash);
        if (!passwordValida) {
            return res.status(401).json({ 
                error: 'Credenciales incorrectas',
                message: 'Usuario/Email y/o contraseña incorrectos' 
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