const router = require('express').Router();
const resenasRouter = require('./reseñas');
const verificarToken = require('../middlewares/auth');

router.get('/mias', verificarToken, resenasRouter.listarMias);  
router.get('/', resenasRouter.listar);
router.get('/:id', resenasRouter.obtener);
router.get('/libro/:libro_id/promedio', resenasRouter.obtenerPromedio);

// Rutas protegidas - Crear y eliminar reseñas (requieren autenticación)

router.post('/', verificarToken, resenasRouter.crear);
router.delete('/:id', verificarToken, resenasRouter.eliminar);

module.exports = router;