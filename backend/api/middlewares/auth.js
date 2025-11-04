const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Token no proporcionado',
            message: 'Debes incluir el header Authorization' 
        });
    }
    
    // Verificar formato "Bearer TOKEN"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ 
            error: 'Formato de token inválido',
            message: 'El formato debe ser: Bearer {token}' 
        });
    }
    
    const token = parts[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // { id, user, rol }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expirado',
                message: 'Por favor, inicia sesión nuevamente' 
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Token inválido',
                message: 'El token proporcionado no es válido' 
            });
        }
        return res.status(401).json({ 
            error: 'Error de autenticación',
            message: error.message 
        });
    }
}

module.exports = verificarToken;