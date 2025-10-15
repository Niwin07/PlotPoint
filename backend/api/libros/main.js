const router = require('express').Router();
const librosRouter = require('./libros');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', librosRouter.listar);
router.get('/:id', librosRouter.obtener);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, librosRouter.crear);
router.put('/:id', verificarToken, librosRouter.actualizar);

// Rutas de administrador
router.delete('/:id', verificarToken, verificarAdmin, librosRouter.eliminar);

module.exports = router;