const express=require('express');
const router=express.Router();
const passport = require('passport');

const userController=require('../controller/users');

router.post('/create',userController.create);
router.get('/signup',userController.signup);
router.get('/login',userController.login);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/login'},
),userController.createSession);
router.get('/signout',userController.destroySession);
router.post('/update-password',userController.updatePassword);
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/reset-password',userController.resetPassword);
router.get('/auth/google/callback',passport.authenticate(
    'google',
    {failureRedirect: '/login'},
),userController.createSession);
module.exports=router;