const express=require('express');
const app=express();
const Router=express.Router;
const port=8000;
const mongoose=require('mongoose');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport');
const MongoStore=require('connect-mongodb-session')(session);
const expressLayouts = require('express-ejs-layouts');
const flash=require('connect-flash');
const { setFlash } = require('./config/middleware');
const FlashMiddleware=require('./config/middleware');
const passportGoogleStragtegy=require('./config/passport-google-strategy');
app.use(express.urlencoded());

// set up the view engine
app.use(express.static('./assets'));
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './view');
app.use(session({
        name: 'AuthenicationTask',
        // TODO change the secret before deployment in production mode
        secret: 'blahsomething',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },
        store: new MongoStore(
            {
                mongooseConnection: db,
                autoRemove: 'disabled'
            },
            function(err){
                console.log(err ||  'connect-mongodb setup ok');
            }
        )
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.setAuthentication);

app.use(flash());
app.use(FlashMiddleware.setFlash);

app.use('/',require('./Router'));


app.listen(port,(err)=>{
       if(err){
        console.log(err);
       } 
       else
        console.log(`Application rum on localhost${port}`);
});
