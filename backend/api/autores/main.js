const router = require('express').Router();
const autoresRouter = require('./autores');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', autoresRouter.listar);
router.get('/:id', autoresRouter.obtener);


// Rutas de administrador
router.post('/', verificarToken, verificarAdmin, autoresRouter.crear);
router.put('/:id', verificarToken, verificarAdmin,autoresRouter.actualizar);
router.delete('/:id', verificarToken, verificarAdmin, autoresRouter.eliminar);

module.exports = router;