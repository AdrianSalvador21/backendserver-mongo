var express = require('express');


var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();



var Hospital = require('../models/hospital');

//OBTENER ALL LOS Hospitales
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //si viene un parametro llamado desde ocupara el nunmero, si no, ocupara 0
    desde = Number(desde);

    //cuando el usuario haga get a la raiz de mi ruta de usuarios
    //Obtener todos los usuarios
    Hospital.find({})
        .skip(desde) //se salta el numero de elementos
        .limit(5) //indica en numero de registros que regresa
        .populate('usuario', 'nombre email') //nos trae toda la info del usuario
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) =>{
                  res.status(200).json({
                      ok: true,
                      hospitales: hospitales,
                      total: conteo
                  });
                })


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

    Hospital.findById(id, (err, hospital) =>{

      if (err) { //El error se genera si existe un error de busqueda
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al buscar hospital',
              errors: err
          });
      }

      if(!hospital){
          return res.status(400).json({
             ok: false,
              mensaje: 'El hospital con el id' + id + ' no existe',
              errors: {message: 'No existe un hospital con ese ID'}
          });
      }

      hospital.nombre = body.nombre;
      hospital.usuario = req.usuario._id;

      hospital.save((err, hospitalGuardado) => {

          if (err) {
              return res.status(400).json({
                  ok: false,
                  mensaje: 'Error al actualizar hospital',
                  errors: err
              });
          }


          res.status(200).json({
              ok: true,
             hospital: hospitalGuardado
          });

      }); //fin usuario.save

    }); //fin usuario.findById

});



//CREAR UN NUEVO hospital
app.post('/', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });


    });


});








//BORRAR hospital POR ID
app.delete('/:id',  mdAutenticacion.verificaToken,(req,res) =>{

  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar hospital',
            errors: err
        });
    }

    if (!hospitalBorrado) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No existe un hospital con ese ID',
            errors: err
        });
    }

    res.status(200).json({
        ok: true,
        hospital: hospitalBorrado
    });
  })

}); //Fin app.dele




module.exports = app;
