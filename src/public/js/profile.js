/* ----------- CREACION SOCKET ----------- */

const socket = io();

/* -----------       FIN       ----------- */

/* ----------- COMPORTAMIENTO WEB ----------- */

// Funcion que contiene el comportamiento de la web
window.onload = (socket) => {
    console.log(socket.username); 
};

/* -----------        FIN         ----------- */