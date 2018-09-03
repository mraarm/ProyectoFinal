  /* ----------------- REQUIRES ----------------- */
  
  // EXPRESS: Framework para simplifica la creacion del servidor
  const express = require('express'); 
  
  // MOONGOOSE: Sirve para establecer la connexion a la base de datos
  const mongoose = require('mongoose');
  
  // MONGO MODEL: Cargamos los modelos de moongoose
  const User = require('./../models/user'); 
  
  // BCRYPT: Srive para crear un hash y asi codificar la contraseña
  const bcrypt =  require('bcrypt');
  
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
    res.render('login', { message: "" }); 
}); 

// Ruta para el Login, valida el usuario i la contraseña
router.post('/login', (req, res) => {
    
    console.log("\nComprovando datos para hacer el LOGIN\n");
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
        
        // Convertimos la informacion a JSON 
        body = toJSON(body);
        
        // Variable donde guardamos el usuario o el username
        let find = {}; 
        
        // En caso de que nos den el mail
        if ( (body.username).indexOf('%40') !== -1 ) {
            
            console.log("\nHan usado el mail @\n");
            
            // Buscaremos por el mail
            find["email"] = body.username;
            
        } else {
            // Por defecto buscaremos por el usuario
            find['username'] = body.username; 
        }
        
        // Comprovamos los valores 
        let user = null; 
        
        // Comprobamos que la informacion es correcta antes de hacer el login
        User.find(find, 'password').cursor()
        .on('data', (data) => {
            user = data; 
            console.log( "JSON", user); 
        })
        .on('end', () => { 
            // Si no hay documento
            if (user) {
                
                let hash = user.password;
                let password = body.password; 
                
                // console.log(hash, password);
                
                
                if (bcrypt.compareSync(body.password, user["password"])) {
                    res.render('profile'); 
                } else {
                    res.render('login', { message: "Contraseña incorrecta" });
                }
            } else res.render('login', { message: "El usuario no existe" }); 
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
    
    console.log("Comprovando datos para hacer el SINGUP\n");
    
    // Creamos una variable donde se guardara los parametros
    let body = ''; 
    
    // Cada vez que recibimos un chunk (stream que contiene los datos)
    req.on('data', (data) => {
        
        console.log("Recibiendo datos");
        
        body += data.toString();
        
    }); 
    
    // Cuando acabe de enviarnos los datos, enviara el evento end
    req.on('end', () => {
        
        console.log("Comprovando datos para hacer el SINGUP\n");
        
        // Creamos el objeto que guardaremos
        body = toJSON(body); 
        
        // Creamos el usuario
        let newUser = new User(body); 
        
        // Guardamos el usuario
        newUser.save()
        .then( () => { 
            res.render('profile');
        })
        .catch( (err) => {
            if ( (err.errmsg).indexOf('username') !== -1 ) res.render('singup', { email: "", username: " Username usado" } );
            else if ( (err.errmsg).indexOf('email') !== -1 ) res.render('singup', { email: "Email usado", username: "" } );
            else console.log(err); 
        }); 
    });
}); 

// Ruta para el perfil
router.get('/perfil',(req, res) => {
    
    console.log("GET - To file chat.ejs");
    conosle.log(req.body); 
    
    res.render('chat'); 
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

module.exports = router; 

/* -----------------    FIN   ----------------- */