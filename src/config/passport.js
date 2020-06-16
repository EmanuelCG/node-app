const passport = require('passport');
const locaStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new locaStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'Not user find' }); // El primer parametro del metodo done es en caso haya un error, el segudo si encuentra o no un usuario y el tercero es un mensaje
    } else {
        //Validar coontraseña
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password' });
        }
    }
}));

passport.serializeUser((user, done) => { //Almacenamos el id del usuario en una sesion 
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});