var express = require('express');


var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();



var Medico = require('../models/medico');

//OBTENER ALL LOS medicos
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //si viene un parametro llamado desde ocupara el nunmero, si no, ocupara 0
    desde = Number(desde);

    //cuando el usuario haga get a la raiz de mi ruta de usuarios
    //Obtener todos los usuarios
    Medico.find({}) //traer todos lo valores
        .skip(desde) //se salta el numero de elementos
        .limit(5) //indica en numero de registros que regresa
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) =>{
                  res.status(200).json({
                      ok: true,
                      medicos: medicos,
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

    Medico.findById(id, (err, medico) =>{

      if (err) { //El error se genera si existe un error de busqueda
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al buscar medico',
              errors: err
          });
      }

      if(!medico){
          return res.status(400).json({
             ok: false,
              mensaje: 'El medico con el id' + id + ' no existe',
              errors: {message: 'No existe un medico con ese ID'}
          });
      }

      medico.nombre = body.nombre;
      medico.usuario = req.usuario._id;
      medico.hospital = body.hospital;

      medico.save((err, medicoGuardado) => {

          if (err) {
              return res.status(400).json({
                  ok: false,
                  mensaje: 'Error al actualizar medico',
                  errors: err
              });
          }


          res.status(200).json({
              ok: true,
             medico: medicoGuardado
          });

      }); //fin usuario.save

    }); //fin usuario.findById

});



//CREAR UN NUEVO hospital
app.post('/', mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });


    });


});








//BORRAR hospital POR ID
app.delete('/:id',  mdAutenticacion.verificaToken,(req,res) =>{

  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al borrar medico',
            errors: err
        });
    }

    if (!medicoBorrado) {
        return res.status(500).json({
            ok: false,
            mensaje: 'No existe un medico con ese ID',
            errors: err
        });
    }

    res.status(200).json({
        ok: true,
        medico: medicoBorrado
    });
  })

}); //Fin app.dele




module.exports = app;
