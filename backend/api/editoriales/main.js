const router = require('express').Router();
const editorialesRouter = require('./editoriales');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', editorialesRouter.listar);
router.get('/:id', editorialesRouter.obtener);

// Rutas de administrador
router.post('/', verificarToken, verificarAdmin, editorialesRouter.crear);
router.put('/:id', verificarToken, verificarAdmin, editorialesRouter.actualizar);
router.delete('/:id', verificarToken, verificarAdmin, editorialesRouter.eliminar);

module.exports = router;