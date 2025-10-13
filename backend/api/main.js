const router = require('express').Router();

const usuariosRouter = require('./usuarios/main');


router.use('/usuarios', usuariosRouter);

router.get('/', function(req, res, next){
    res.send("Archivo principal de la API");
})

module.exports = router;

