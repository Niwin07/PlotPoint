const router = require('express').Router();
const likesRouter = require('./likes');
const verificarToken = require('../middlewares/auth');

// Rutas públicas - Ver favoritos de usuarios
router.get('/usuario/:usuario_id', likesRouter.obtenerFavoritosUsuario);
router.get('/libro/:libro_id', likesRouter.obtenerUsuariosPorLibro);

// Rutas protegidas - Gestionar favoritos propios
router.get('/mis-favoritos', verificarToken, likesRouter.misFavoritos);
router.get('/check/:libro_id', verificarToken, likesRouter.verificarFavorito);
router.post('/', verificarToken, likesRouter.marcarFavorito);
router.delete('/:libro_id', verificarToken, likesRouter.desmarcarFavorito);

module.exports = router;