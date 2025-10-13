// api/middlewares/auth.js
const jwt = require('jsonwebtoken');

// Clave secreta (debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_segura';

function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // { id, user, rol }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

module.exports = verificarToken;