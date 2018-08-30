var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

//Nos permite definir esquemas
var Schema = mongoose.Schema;


//controlar roles validos
var rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol permitido'
};

//Definimos el esquema
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}

});

//usuarioSchema.plugin(uniqueValidator, {message: 'El correo debe de ser unico'})
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'});

//Exportamos el esquema
module.exports = mongoose.model('Usuario', usuarioSchema);
