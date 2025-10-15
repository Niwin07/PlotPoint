const router = require('express').Router();
const generosRouter = require('./generos');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', generosRouter.listar);
router.get('/:id', generosRouter.obtener);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, generosRouter.crear);
router.put('/:id', verificarToken, generosRouter.actualizar);

// Rutas de administrador
router.delete('/:id', verificarToken, verificarAdmin, generosRouter.eliminar);

module.exports = router;