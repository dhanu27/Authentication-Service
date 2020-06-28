const passport=require('passport');
const GoogleStrategy =require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const { doesNotMatch } = require('assert');

//tell passport  Use GoogleStrategy
passport.use(new GoogleStrategy({
    clientID: '155943385522-8u1cgo8plstg9105gnojshp1aeruc0li.apps.googleusercontent.com',
    clientSecret:"eL7OMSgofSw4gTcsTrSBCGo2",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //   find user 
    User.findOne({ email: profile.emails[0].value}).exec(function (err, user) {
        if(err){console.log("Error in google auth",err); return ;}
      console.log(profile);
      if(user){
        //   If found send to homepage
       return done(null,user);
      }
      else{
        //   Not found Create new User with google id
          User.create({
              email:profile.emails[0].value,
              name:profile.displayname,
              password:crypto.randomBytes(20).toString('hex')
          },function(err,user){
            if(err){console.log("Error while creating by google auth",err); return ;}
            return done(null,user);
          });
      }
    });
  }
));
module.exports=passport;