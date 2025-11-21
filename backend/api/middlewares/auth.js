const { verificarToken } = require('@damianegreco/hashpass');

const { TOKEN_SECRET } = process.env;

function middleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Token no proporcionado',
            message: 'Debes incluir el header Authorization' 
        });
    }
    
    let token;
    const parts = authHeader.split(' ');
    
    if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
    } else if (parts.length === 1) {
        token = parts[0];
    } else {
        return res.status(401).json({ 
            error: 'Formato de token inválido',
            message: 'El formato debe ser: Bearer {token} o solo {token}' 
        });
    }
    
    const verificacion = verificarToken(token, TOKEN_SECRET);
    
    if (verificacion?.data) {
        req.usuario = verificacion.data; 
        next();
    } else {
        return res.status(401).json({ 
            error: 'Token inválido o expirado',
            message: 'Por favor, inicia sesión nuevamente' 
        });
    }
}

module.exports = middleware;