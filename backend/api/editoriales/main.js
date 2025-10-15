const router = require('express').Router();
const editorialesRouter = require('./editoriales');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', editorialesRouter.listar);
router.get('/:id', editorialesRouter.obtener);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, editorialesRouter.crear);
router.put('/:id', verificarToken, editorialesRouter.actualizar);

// Rutas de administrador
router.delete('/:id', verificarToken, verificarAdmin, editorialesRouter.eliminar);

module.exports = router;