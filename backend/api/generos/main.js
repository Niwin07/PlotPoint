const router = require('express').Router();
const generosRouter = require('./generos');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', generosRouter.listar);
router.get('/:id', generosRouter.obtener);

// Rutas de administrador
router.delete('/:id', verificarToken, verificarAdmin, generosRouter.eliminar);
router.post('/', verificarToken, verificarAdmin, generosRouter.crear);
router.put('/:id', verificarToken, verificarAdmin, generosRouter.actualizar);

module.exports = router;