const router = require('express').Router();
const { verificarPass, generarToken } = require('@damianegreco/hashpass');
const db = require('../../conexion');

const TOKEN_SECRET = process.env.TOKEN_SECRET || process.env.JWT_SECRET;
const TOKEN_EXPIRES_HOURS = 6;

if (!TOKEN_SECRET) {
    console.error('ERROR: TOKEN_SECRET no está definido en las variables de entorno');
}

router.post('/', async function(req, res) {
    let { nombre_usuario, contrasena } = req.body;

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

        const passwordValida = verificarPass(contrasena, usuario.contrasena_hash);
        if (!passwordValida) {
            return res.status(401).json({ 
                error: 'Credenciales incorrectas',
                message: 'Usuario/Email y/o contraseña incorrectos' 
            });
        }

        const token = generarToken(
            TOKEN_SECRET,
            TOKEN_EXPIRES_HOURS,
            { 
                id: usuario.id, 
                nombre_usuario: usuario.nombre_usuario,
                rol: usuario.rol || 'usuario'
            }
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