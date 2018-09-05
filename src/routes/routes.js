/* ----------------- REQUIRES ----------------- */

// EXPRESS: Framework para simplifica la creacion del servidor
const express = require('express'); 

// MOONGOOSE: Sirve para establecer la connexion a la base de datos
const mongoose = require('mongoose');

// MONGO MODEL: Cargamos los modelos de moongoose
const User = require('./../models/user'); 

// BCRYPT: Srive para crear un hash y asi codificar la contraseña
const bcrypt =  require('bcrypt');

// VARIABLE: contiene el socket que usaremos
let server; 

// SOCKET.IO: Framework para el traspasso de datos a tiempo real
const io = require('socket.io')(server);  

/* -----------------    FIN   -----------------*/

/* -----------------    CONNECTION MONGOOSE   -----------------*/

// Creamos la connexion con la base de datos MongoDB, en el localhost
mongoose.connect('mongodb://localhost/nodejs', { useNewUrlParser: true })
.then(() => {
    console.log("\n### Conexion con MongoDB correcta".bold.yellow);
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
    
    console.log("GET - To file index.ejs".green);
    
    res.render('index');
    
}); 

// Ruta para el Login 
router.get('/login',(req, res) => {
    
    console.log("GET - To file login.ejs".green);
    
    res.render('login', { message: "" }); 
    
}); 

// Ruta para el Login, valida el usuario i la contraseña
router.post('/login', (req, res) => {
    
    console.log("\nLOGEANDO USUARIO\n".bgBlack.cyan);
    // Creamos una variable donde se guardara los parametros
    let body = ''; 
    
    // Cada vez que recibimos un chunk (stream que contiene los datos)
    req.on('data', (data) => {
        
        console.log("\nRecibiendo datos \n");
        
        body += data.toString();
    }); 
    
    // Cuando acabe de enviarnos los datos, enviara el evento end
    req.on('end', () => {
        
        console.log("\nDatos recibidos\n");
        
        // Convertimos la informacion a JSON 
        body = toJSON(body);
        
        // Variable donde guardamos el usuario o el username
        let find = {}; 
        
        // En caso de que nos den el mail
        if ( body.username && (body.username).indexOf('%40') !== -1 ) {
            
            console.log("\nMail usado para el login\n");
            
            // Buscaremos por el mail
            find["email"] = body.username;
            
        } else {
            
            console.log("\nUsername usado para el login\n");
            
            // Por defecto buscaremos por el usuario
            find['username'] = body.username; 
        }
        
        // Comprovamos los valores 
        let user = null; 
        
        // Comprobamos que la informacion es correcta antes de hacer el login
        User.find(find).cursor()
        .on('data', (data) => {
            
            console.log( "\nDatos USUARIO pedido: \n" + data + "\n");
            
            user = data; 
            
        })
        .on('end', () => { 
            
            // Comprovamos si existe el usuario
            if (user) {
                
                // Si existe gaurdamos las contraseñas, la hasheada y la normal
                let hash = user.password;
                let password = body.password; 
                
                console.log("\nContraseña en HASH: " + hash + ".\nConstraseña: " + password + "\n");
                
                if (bcrypt.compareSync(body.password, user["password"])) {
                    
                    // La contraseña es correcta añadimos la _id del usuario a la session de express-session
                    req.session.userId = user; 
                    
                    // Redirigimos a la pagina de perfil
                    res.redirect('/profile'); 
                    
                } else {
                    
                    // La contraseña es erronea
                    res.render('login', { message: "Contraseña incorrecta" });
                    
                }
                
            } else {
                
                // No existe el usuario
                res.render('login', { message: "El usuario no existe" }); 
                
            }
        }); 
    }); 
}); 

// Ruta para el Singup
router.get('/singup',(req, res) => {
    
    console.log("GET - To file singup.ejs");
    
    res.render('singup', { email: "", username: "" } ); 
    
});

// Ruta para el Singup, guarda los datos en la base de datos
router.post('/singup', (req, res) => {
    
    console.log("\nSINGUPEANDO USUARIO\n".bgBlack.cyan);
    
    // Creamos una variable donde se guardara los parametros
    let body = ''; 
    
    // Cada vez que recibimos un chunk (stream que contiene los datos)
    req.on('data', (data) => {
        
        console.log("\nRecibiendo datos\n");
        
        body += data.toString();
        
    }); 
    
    // Cuando acabe de enviarnos los datos, enviara el evento end
    req.on('end', () => {
        
        console.log("\nDatos recibidos\n");
        
        // Creamos el objeto que guardaremos
        body = toJSON(body); 
        
        // Creamos el usuario
        let newUser = new User(body); 
        
        // Guardamos el usuario
        newUser.save()
        .then( () => { 
            
            res.redirect('/login');
            
        })
        .catch( (err) => {
            
            // Comprovamos que es el que esta mal si mail o username
            if ( (err.errmsg).indexOf('username') !== -1 ) res.render('singup', { email: "", username: " Username usado" } );
            else if ( (err.errmsg).indexOf('email') !== -1 ) res.render('singup', { email: "Email usado", username: "" } );
            else console.log(err);
            
        }); 
    });
}); 

// Ruta para el perfil
router.get('/profile',(req, res) => {
    
    console.log("\nGET - To file chat.ejs\n");

    // Comprovamos si existe el objeto userId, para saber si esta logeado
    if ( req.session.userId ) {

        // Añadimos el nombre de usuario al socket
        io.on('connected', (socket) => {
            socket.username = req.session.userId.username; 
        });

        // Renderizamos el user, con los datos de este
        res.render('profile',
            { 
                username: req.session.userId.username,
                email: (req.session.userId.email).replace('%40', '@'), 
                fullName: (req.session.userId.name + " " + req.session.userId.lastname).replace('\+', ' ')
            }
        ); 
    
    } else {
        
        // Si no se ha loggeado lo chutamos
        res.render('login', { message: "Necessitas hacer LOGIN" });

    }

}); 

/* -----------------  FIN  ----------------- */

/* -----------------  FUNCIONES PERSONALIZADAS  ----------------- */

/**
* Funcion que nos convierte un String en un JSON 
* 
* @param {String} data 
*/
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

/* -----------------             FIN            ----------------- */

/* -----------------  EXPORT  ----------------- */

module.exports.router = router; 
module.exports.server = server; 

/* -----------------    FIN   ----------------- */