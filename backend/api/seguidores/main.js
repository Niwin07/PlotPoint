const router = require('express').Router();
const seguidoresRouter = require('./seguidores');
const verificarToken = require('../middlewares/auth');


// seguir a un usuario
router.post('/', verificarToken, seguidoresRouter.seguirUsuario);

// dejar de seguir a un usuario
router.delete('/:seguido_id', verificarToken, seguidoresRouter.dejarDeSeguir);

// verificar si yo sigo a un usuario
router.get('/check/:usuario_id', verificarToken, seguidoresRouter.verificarSeguimiento);

// obtener la lista de seguidores de un usuario
router.get('/:usuario_id/seguidores', seguidoresRouter.obtenerSeguidores);

// obtener la lista de usuarios que sigue un usuario
router.get('/:usuario_id/seguidos', seguidoresRouter.obtenerSeguidos);


module.exports = router;