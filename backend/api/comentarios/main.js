const router = require('express').Router();
const comentariosRouter = require('./comentarios');
const verificarToken = require('../middlewares/auth');

// Rutas públicas - Obtener comentarios
router.get('/', comentariosRouter.listar);
router.get('/:id', comentariosRouter.obtener);
router.get('/resena/:resena_id', comentariosRouter.obtenerPorResena);

// Rutas protegidas - Crear y eliminar comentarios (requieren autenticación)
router.post('/', verificarToken, comentariosRouter.crear);
router.delete('/:id', verificarToken, comentariosRouter.eliminar);

module.exports = router;