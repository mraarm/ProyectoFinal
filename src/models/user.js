/* ----------- REQUIRES ----------- */

// MOONGOOSE: Sirve para establecer la connexion a la base de datos
const mongoose = require('mongoose');

// BCRYPT: Srive para crear un hash y asi codificar la contraseña
const bcrypt =  require('bcrypt');

/* -----------    FIN   ----------- */

/* ----------- ESQUEMAS MONGO ----------- */

// Esquema que define la informacion del usuario que estamos guardando
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: false
        }, 
        lastname:{
            type: String, 
            required: false
        }, 
        username: {
            type: String, 
            required: true, 
            unique: true
        },
        password: {
            type: String, 
            required: true
        }, 
        email: {
            type: String, 
            required: true, 
            unique: true
        }
    }
); 

/* -----------       FIN      ----------- */

/* ----------- FUNCIONES ANTES DE GUARDAR ----------- */

// Creamos un metodo que antes de guardar el documento encripta la contraseña con Bcrypt
UserSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) return next(err);
      user.password = hash;
      next();
    })
  });
    
    /* -----------            FIN             ----------- */
    
    /* ----------- MODELOS MONGO ----------- */
    
    const User = mongoose.model('users', UserSchema); 
    
    /* -----------      FIN      ----------- */
    
    /* ----------- EXPORTAMOS ----------- */
    
    module.exports = User; 
    
    /* -----------     FIN    ----------- */