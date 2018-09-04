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

// COLORS: Modulo para poner colores a logs
const colors = require('colors');

/* -----------------    FIN   -----------------*/

/* ----------------- SETTINGS EXPRESS ----------------- */

// Definimos el puerto donde escuchara el servidor, puede ser dado por el sistema operativo o el 3000
let puerto = process.env.PORT || 3000
app.set('port', puerto); 

// Definimos el motor para renderizar las vistas i definimos donde estaran las carpetas 
app.set('view engine', 'ejs'); 
app.set('views', path.resolve(__dirname, './views')); 

/* -----------------        FIN       ----------------- */

/* ----------------- FICHEROS ESTATICOS ----------------- */

// Ruta donde econtraremos los ficheros css, js y las imagenes
app.use(express.static(path.resolve(__dirname, './public'))); 

/* -----------------       FIN          ----------------- */

/* ----------------- MIDDLEWARE ----------------- */

// Ponemos expres-session para contraolar las sesiiones de los usuarios
app.use(session({
    secret: 'DawWebProject',
    resave: true,
    saveUninitialized: false
  })); 

/* -----------------      FIN   ----------------- */

/* ----------------- RUTAS DE SERVIDOR  ----------------- */

// Importamos las rutas de la carpeta rutas
const routes = require('./routes/routes'); 

// Definimos las rutas, que usaremos para la web
app.use('/', routes); 

/* -----------------       FIN          ----------------- */

/* ----------------- CREAMOS SERVIDOR ----------------- */

// Creamos una variable que contiene el servidor escuchando en el puerto 3000 o el proporcionado por la maquina
const server = app.listen( app.get('port'), function () {
    console.log( ("\n###   Servidor escuchando en el puerto: " + app.get("port") + "\n").bold.magenta);
});

// Creamos el servidor de SOCKET.IO usando el servidor que ya habiamos creado
const io =  socketio(server); 

/* -----------------        FIN       ----------------- */

/* ----------------- CONNEXION SOCKETS ----------------- */
                                                         
io.on('connection', (socket) => {             

    console.log("\n---------- SOCKETS.IO ----------- \n".red);      
    console.log("SOCKET ID:", socket.id);                
    console.log("SOCKET ROOM:", socket.rooms);
    console.log("\n---------- SOCKETS.IO ----------- \n".red);

    // Capturaremos el evento de cada login
    socket.on('logged', (data) => {
        socket.username = session.userId; 
        console.log(socket.username);
    }); 
    
});                                                      
                                                         
/* -----------------        FIN        ----------------- */