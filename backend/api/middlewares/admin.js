function verificarAdmin(req, res, next) {
    if (!req.usuario) {
        return res.status(401).json({ 
            error: 'No autenticado',
            message: 'Debes estar autenticado para acceder a este recurso' 
        });
    }
    
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'Se requiere rol de administrador para esta acción' 
        });
    }
    
    next();
}

module.exports = verificarAdmin;