var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');



app.post('/', (req, res) =>{

  var body = req.body;

  Usuario.findOne({email: body.email}, (err, usuarioDB) => {

    if (err) { //Error llega si es un problema de servidor, no si el usuario es null o vacio
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            errors: err
        });
    }

    //Error de correo
    if(!usuarioDB){
      return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas - email',
          errors: err
      });
    }

    //Error de contrasenia
    if(!bcrypt.compareSync(body.password, usuarioDB.password)){ //caso de que no son iguales
      return res.status(400).json({
          ok: false,
          mensaje: 'Credenciales incorrectas - password',
          errors: err
      });
    }


    //Crear un token!!
    usuarioDB.password = '=D';
    var token = jwt.sign({ usuario:usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas



    res.status(201).json({
        ok: true,
        usuario: usuarioDB,
        token:token,
        id: usuarioDB._id
    });

  })



})










module.exports = app;
