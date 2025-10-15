const router = require('express').Router();
const autoresRouter = require('./autores');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', autoresRouter.listar);
router.get('/:id', autoresRouter.obtener);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, autoresRouter.crear);
router.put('/:id', verificarToken, autoresRouter.actualizar);

// Rutas de administrador
router.delete('/:id', verificarToken, verificarAdmin, autoresRouter.eliminar);

module.exports = router;