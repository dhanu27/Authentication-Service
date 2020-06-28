const User=require('../models/user');
const bcrypt=require('bcrypt');

// Render the signup page
module.exports.signup=function(req,res){
    return res.render('signup');
}

// create user for app
module.exports.create=async function(req,res){
    try{
        // check passwords are same 
      if(req.body.password!=req.body.confirmPassword){
          console.log("Password are not same");
          req.flash("error","Password are not same");
         return res.redirect('back');
      }
      let user=await User.findOne({email:req.body.email});
    //   If user alredy exist
      if(user){
          req.flash("error","User already exits");
          return res.redirect('back');
      }
      
    //   Salt for hasing encryption
         const salt = await bcrypt.genSalt(10);
         req.body.password =await bcrypt.hash(req.body.password, salt);
        //  create a user
          await User.create(req.body);
          req.flash("success","Succesfully created a acount");
          return res.render('home',{
              name:req.body.name
          });
    }catch(err){
          console.log("%%%%Error%%%%%",err);
    }
}

// To render a login Page
module.exports.login=function(req,res){

    return res.render('login');
}

// create a session while user login 
module.exports.createSession = function(req, res){
    req.flash("success","You logged in ");
    console.log("You logged in");
    return res.redirect('/');
}

// for signput destroy session
module.exports.destroySession=function(req,res){
        req.logOut();
        req.flash('success',"You have Logged out");
        console.log("You have Logged out");
        res.redirect('/');
}

// To render reset page 
module.exports.resetPassword=function(req,res){
    return res.render('reset');
}

// For Update Password
module.exports.updatePassword=async function(req,res){
      try{
          console.log(req.body);
        //   check Passwords are same
        if(req.body.password!=req.body.confirmPassword){
            req.flash("error","Passwords are not matching");
             console.log("passwords are not match");
            return res.redirect('back');
        }  
        // find User exits or not 
        let user=await User.findOne({email:req.body.email});
        // Update user password and again encrypt it.
        if(user){
            const salt = await bcrypt.genSalt(10);
             user.password =await bcrypt.hash(req.body.password, salt);
             user.save();
             req.flash('success',"Your get changed");
            return res.redirect('/');
        }
        req.flash('error',"Retry"); 
       return res.redirect('/users/login'); 
      }catch(err){
         console.log("something went wrong",err);
          
      } 
}