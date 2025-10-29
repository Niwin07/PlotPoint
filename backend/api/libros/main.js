const router = require('express').Router();
const librosRouter = require('./libros');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/admin');

// Rutas públicas
router.get('/', librosRouter.listar);
router.get('/:id', librosRouter.obtener);

// Rutas de administrador (todas las operaciones de modificación)
router.post('/', verificarToken, verificarAdmin, librosRouter.crear);
router.put('/:id', verificarToken, verificarAdmin, librosRouter.actualizar);
router.post('/:id/upload-portada', verificarToken, verificarAdmin, ...librosRouter.subirPortada);
router.delete('/:id/delete-portada', verificarToken, verificarAdmin, librosRouter.eliminarPortada);
router.delete('/:id', verificarToken, verificarAdmin, librosRouter.eliminar);

module.exports = router;