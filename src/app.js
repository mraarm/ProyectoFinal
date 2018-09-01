/* ----------------- REQUIRES ----------------- */

// EXPRESS: Framework para simplifica la creacion del servidor
const express = require('express');

// Creamos la app, que servira como servidor 
const app  = express(); 

// SOCKET.IO: Framework para el traspasso de datos a tiempo real
const socketio = require('socket.io');  

// EXPRES-SESSION: Modulo que sirve para manejar las sessiones de los usuarios
const session = require('express-session'); 

// PATH: Modulo de Node.JS para tratar las direcciones del sistema
const path = require('path');

/* -----------------    FIN   -----------------*/

/* ----------------- SETTINGS EXPRESS ----------------- */

// Definimos el puerto donde escuchara el servidor, puede ser dado por el sistema operativo o el 30000
app.set('port', process.env.PORT || 3000); 

// Definimos el motor para renderizar las vistas i definimos donde estaran las carpetas 
app.set('view engine', 'ejs'); 
app.set('views', path.resolve(__dirname, './views')); 

/* -----------------        FIN       ----------------- */

/* ----------------- FICHEROS ESTATICOS ----------------- */

// Ruta donde econtraremos los ficheros css, js y las imagenes
app.use(express.static(path.resolve(__dirname, './public'))); 

/* -----------------       FIN          ----------------- */

/* ----------------- RUTAS DE SERVIDOR  ----------------- */

// Importamos las rutas de la carpeta rutas
const routes = require('./routes/routes'); 

// Definimos las rutas 
app.use('/', routes); 

/* -----------------       FIN          ----------------- */

/* ----------------- MIDDLEWARE ----------------- */

// Ponemos expres-session para contraolar las sesiiones de los usuarios
app.use(session({
    secret: '3jn4jb3k5b43kjb*¨P?=)·LjnsjdkS·KDF',
    saveUninitialized: false, 
    resave: true
})); 

/* -----------------      FIN   ----------------- */

/* ----------------- CREAMOS SERVIDOR ----------------- */

// Creamos una variable que contiene el servidor escuchando en el puerto 3000 o el proporcionado por la maquina
const server = app.listen( app.get('port'), () => {
    console.log("Server running on port:", app.get('port'));
});

// Creamos el servidor de SOCKET.IO usando el servidor que ya habiamos creado
const io =  socketio(server); 

/* -----------------        FIN       ----------------- */

/* ----------------- CONNEXION SOCKETS ----------------- */
                                                         
io.on('connection', (socket) => {                        
    console.log("--------------------------------")      
    console.log("SOCKET ID:", socket.id);                
    console.log("SOCKET ROOM:", socket.rooms);           
});                                                      
                                                         
/* -----------------        FIN        ----------------- */