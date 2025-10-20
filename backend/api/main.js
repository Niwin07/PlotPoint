const router = require('express').Router();

const usuariosRouter = require('./usuarios/main');
const resenasRouter = require('./reseñas/main');
const librosRouter = require('./libros/main');
const comentariosRouter = require('./comentarios/main');
const likesRouter = require('./likes/main')

router.use('/usuarios', usuariosRouter);
router.use('/resenas', resenasRouter); 
router.use('/libros', librosRouter);
router.use('/comentarios', comentariosRouter);
router.use('/likes', likesRouter)

router.get('/', function(req, res, next){
    res.send("Archivo principal de la API");
})

module.exports = router;