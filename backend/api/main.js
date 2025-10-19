const router = require('express').Router();

const usuariosRouter = require('./usuarios/main');
const resenasRouter = require('./reseñas/main'); // El nombre del archivo/carpeta puede quedarse con ñ

router.use('/usuarios', usuariosRouter);
router.use('/resenas', resenasRouter); // ⬅️ SIN ñ en la URL

router.get('/', function(req, res, next){
    res.send("Archivo principal de la API");
})

module.exports = router;