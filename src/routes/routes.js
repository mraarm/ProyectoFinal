/* ----------------- REQUIRES ----------------- */

// EXPRESS: Framework para simplifica la creacion del servidor
const express = require('express'); 

// MOONGOOSE: Sirve para establecer la connexion a la base de datos
const mongoose = require('mongoose');

// MONGO MODEL: Cargamos los modelos de moongoose
const User = require('./../models/user'); 

// URL: Sirve para tratar la URL que nos piden 
const url = require('url'); 

/* -----------------    FIN   -----------------*/

/* -----------------    CONNECTION MONGOOSE   -----------------*/

// Creamos la connexion con la base de datos MongoDB, en el localhost
mongoose.connect('mongodb://localhost/nodejs', { useNewUrlParser: true })
    .then(() => {
        console.log("Conexion con MongoDB correcta");
    })
    .catch((err) => {
        console.error(err); 
    });
/* -----------------           FIN             -----------------*/

/* ----------------- Router ----------------- */

// Creamos el obejeto router que contendra las rutas
const router = express.Router(); 

/* -----------------   FIN  ----------------- */

/* ----------------- RUTAS ----------------- */

// Ruta para el inicio
router.get('/', (req, res) => {
    console.log("GET - To file index.ejs");
    res.render('index');
}); 

// Ruta para el Login 
router.get('/login',(req, res) => {
    console.log("GET - To file login.ejs");
    res.render('login'); 
}); 

// Ruta para el Login, valida el usuario i la contraseña
router.post('/login', (req, res) => {
    console.log("Comprovando datos para hacer el LOGIN\n");
    // Creamos una variable donde se guardara los parametros
    let body = ''; 
    // Cada vez que recibimos un chunk (stream que contiene los datos)
    req.on('data', (data) => {
        console.log("Recibiendo datos", data.toString());
        body += data.toString();
    }); 
    // Cuando acabe de enviarnos los datos, enviara el evento end
    req.on('end', () => {
        console.log("Recepcion de datos finalizada");
        // Convertimos los datos a un onbbjeto JSON
        let info = toJSON(body); 
        console.log("Datos: ", info); 
        let me = new User(info); 
        me.save(); 
        setTimeout(() => {
            User.find((err, users) => { 
            console.log(users); 
            });
        }, 1000); 
        // Comprobamos que la informacion es correcta antes de hacer el login
        res.render('login'); 
    });
}); 

// Ruta para el Singup
router.get('/singup',(req, res) => {
    console.log("GET - To file singup.ejs");
    res.render('singup'); 
});

// Ruta para el Singup, guarda los datos en la base de datos
router.post('/singup', (req, res) => {
    console.log("Comprovando datos para hacer el SINGUP\n");
    // Creamos una variable donde se guardara los parametros
    let body = ''; 
    // Cada vez que recibimos un chunk (stream que contiene los datos)
    req.on('data', (data) => {
        console.log("Recibiendo datos"/*, data.toString()*/);
        body += data.toString();
    }); 
    // Cuando acabe de enviarnos los datos, enviara el evento end
    req.on('end', () => {
        console.log("Recepcion de datos finalizada");
        // Convertimos los datos a un objeto JSON
        let info = toJSON(body); 
        console.log("Datos: ", info); 
        // Comprovamos que el usuario no existe en la base de datos
        
        // Comprobamos que la informacion es correcta antes de hacer el login
        res.render('login'); 
    });
}); 

// Ruta para el Chat
router.get('/chat',(req, res) => {
    console.log("GET - To file chat.ejs");
    res.render('chat'); 
}); 


/* -----------------  FIN  ----------------- */

/* -----------------  FUNCIONES PERSONALIZADAS  ----------------- */

function toJSON(data) {
    // Convertimos los datos passados a JSON
    let info = {}; 
    // Como la cadena tiene el formato key=value&key=value, etc..a
    // creamos un array con cada pareja de valores y entonces 
    // montamos el objeto json
    data.split('&').forEach(element => {
        let partial = element.split('=');
        // Añadimos cada clave, valor
        info[partial[0]] = partial[1]; 
    }); 
    // Devolvemos el obejto
    return info; 
}

/* -----------------             FIN           ----------------- */

/* -----------------  EXPORT  ----------------- */

module.exports = router; 

/* -----------------    FIN   ----------------- */