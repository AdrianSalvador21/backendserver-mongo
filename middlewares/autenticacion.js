var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//Verificar token

exports.verificaToken = function(req, res, next){
  var token = req.query.token;

  jwt.verify( token, SEED, (err, decoded) =>{
    if (err) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token no valido',
            errors: err
        });
    }

    req.usuario = decoded.usuario;  //tenemos disponible quien hizo la peticion

    next(); //permite continuar con las funciones de abajo


  });
}