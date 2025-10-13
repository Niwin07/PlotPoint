// api/middlewares/admin.js
function verificarAdmin(req, res, next) {
    // req.usuario viene del middleware verificarToken
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
    }
}

module.exports = verificarAdmin;