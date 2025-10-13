// api/usuarios/login.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { verificarPass } = require('@damianegreco/hashpass');
const db = require('../../conexion');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_segura';

router.post('/', function(req, res, next){
    const {user, pass} = req.body;

    // Validación de entrada
    if (!user || !pass) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    let sql = "SELECT id, user, pass, rol, nombre FROM users ";
    sql += "WHERE user = ?";

    db.query(sql, [user])
    .then(([usuarios]) => {
        if(usuarios && usuarios.length === 1){
            const usuario = usuarios[0];
            
            if (verificarPass(pass, usuario.pass)){
                // Generar JWT real
                const token = jwt.sign(
                    { 
                        id: usuario.id, 
                        user: usuario.user,
                        rol: usuario.rol || 'usuario'
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.status(200).json({
                    status: "ok", 
                    token: token,
                    usuario: {
                        id: usuario.id,
                        user: usuario.user,
                        nombre: usuario.nombre,
                        rol: usuario.rol
                    }
                });
            } else {
                res.status(401).json({ error: "Usuario y/o contraseña incorrecto" });
            }
        } else {
            res.status(401).json({ error: "Usuario y/o contraseña incorrecto" });
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Ocurrió un error en el servidor" });
    });
});

module.exports = router;