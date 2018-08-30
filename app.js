// Requires - importacion de librerias
var express = require('express'); //importa express
var mongoose = require('mongoose'); // importar mongoose
var bodyParser = require('body-parser');


//Inicializar variables
var app = express(); //definimos el servidor express


// Body parser // lo podemos ocupar en cualquier lugar
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');





//Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes); //middleware



//Escuchar peticiones
app.listen(3000, () => { //El primer parametro es el puerto, el segundo es el codigo a ejecutar cuando el servidor empiece a correr correctamente

    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online'); //El codigo puesto, solo da color al texto en terminal


})
