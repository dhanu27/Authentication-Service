const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const bcrypt=require('bcrypt');
const { use } = require('passport');

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:true
    },
    function(req,email, password, done){
        // find a user and establish the identity
        User.findOne({email: email},function(err, user){
            if (err){
                console.log(err);
                return done(err);
            }
           // If user not exits
            if (!user){
                req.flash('error',"No user Found");
                console.log(req.body);
               console.log('Invalid Username/Password');
                return done(null, false);
            }
            // Compare two passwords
            bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
                if (err) {
                 console.log("ERROr",err);
                 return ;
                } else if (!isMatch) {
                    req.flash('error','Invalid Password');
                  console.log("Password doesn't match!");
                  return done(null, false);
                } else {
                  console.log("Password matches!")
                  return done(null, user);
                }
              })
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});
// Check if user is sign in or not
passport.checkauthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
   else 
     res.redirect('/users/login'); 
}
passport.setAuthentication=function(req,res,next){
    // set the users for view 
    res.locals.user=req.user;
    next();
}

module.exports = passport;