const express = require('express');
const path = require('path');
const exphbs =  require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport'); 

// Initializations
const app = express();
require('./database');
require('./config/passport');


//Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); // Configuración de directorio de vistas 
app.engine('.hbs', exphbs({ // Motor de plantillas express-handlebars 
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method')); //Metodo Oculto para formularios
app.use(session({ // Configuración sesioens de Express
    secret: 'app-root',
    resave: true,
    saveUninitialized: true
}));

// Middlewares para el Login
app.use(passport.initialize());
app.use(passport.session());

// Mensajes de connect-flash
app.use(flash());

// Global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; //Passport guarda la información de usuario en user, la cual contiene la información del usuario
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Init Servidor
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
})