const router = require('express').Router();

const usuariosRouter = require('./usuarios/main');
const resenasRouter = require('./reseñas/main');
const librosRouter = require('./libros/main');
const comentariosRouter = require('./comentarios/main');
const likesRouter = require('./likes/main')
const busquedaRouter = require('./busqueda/main');
const autoresRouter = require('./autores/main');
const editorialesRouter = require('./editoriales/main')
const generosRouter = require('./generos/main');
const seguidoresRouter = require('./seguidores/main');

router.use('/usuarios', usuariosRouter);
router.use('/resenas', resenasRouter); 
router.use('/libros', librosRouter);
router.use('/comentarios', comentariosRouter);
router.use('/likes', likesRouter)
router.use('/busqueda', busquedaRouter);
router.use('/autores', autoresRouter)
router.use('/editoriales', editorialesRouter);
router.use('/generos', generosRouter);
router.use('/seguidores', seguidoresRouter);

router.get('/', function(req, res, next){
    res.send("Archivo principal de la API");
})

module.exports = router;