var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();



var Usuario = require('../models/usuario');

//OBTENER ALL LOS USUARIOS
app.get('/', (req, res, next) => {

    //cuando el usuario haga get a la raiz de mi ruta de usuarios
    //Obtener todos los usuarios
    Usuario.find({}, 'nombre email img role') //VALORES A TRAEE
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });

});

//vERIFICAR TOKEN
/*app.use('/', (req, res, next)=>{

    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded) =>{
      if (err) {
          return res.status(401).json({
              ok: false,
              mensaje: 'Token no valido',
              errors: err
          });
      }

      next(); //permite continuar con las funciones de abajo


    });


});*/


//ACTUALIZAR USUARIO
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => { //id es obligatorio
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) =>{

      if (err) { //El error se genera si existe un error de busqueda
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al buscar usuario',
              errors: err
          });
      }

      if(!usuario){
          return res.status(400).json({
             ok: false,
              mensaje: 'El usuario con el id' + id + ' no existe',
              errors: {message: 'No existe un usuario con ese ID'}
          });
      }

      usuario.nombre = body.nombre;
      usuario.email = body.email;
      usuario.role = body.role;

      usuario.save((err, usuarioGuardado) => {

          if (err) {
              return res.status(400).json({
                  ok: false,
                  mensaje: 'Error al actualizar usuario',
                  errors: err
              });
          }

          usuarioGuardado.password = '=D'; //Para no regresar el usuario

          res.status(200).json({
              ok: true,
             usuario: usuarioGuardado
          });

      }); //fin usuario.save

    }); //fin usuario.findById

});



//CREAR UN NUEVO USUARIO
app.post('/', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario  //nos permite saber quien creo al usuario
        });


    });


});








//BORRAR USUARIO POR ID
app.delete('/:id',  mdAutenticacion.verificaToken,(req,res) =>{

  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar usuario',
            errors: err
        });
    }

    if (!usuarioBorrado) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No existe un usuario con ese ID',
            errors: err
        });
    }

    res.status(200).json({
        ok: true,
        usuario: usuarioBorrado
    });
  })

}); //Fin app.dele




module.exports = app;
