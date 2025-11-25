const router = require('express').Router(); // Crear un enrutador de Express
// Importar el enrutador de cada entidad
const usuariosRouter = require('./usuarios/main'); 
const resenasRouter = require('./reseñas/reseñas');
const busquedaRouter = require('./busqueda/main');
const librosRouter = require('./libros/libros');
const comentariosRouter = require('./comentarios/comentarios');
const likesRouter = require('./likes/likes');
const autoresRouter = require('./autores/autores');
const editorialesRouter = require('./editoriales/editoriales')
const generosRouter = require('./generos/generos');
const seguidoresRouter = require('./seguidores/seguidores');
// Asociar cada enrutador con su ruta base
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

module.exports = router; // Exportar el enrutador principal