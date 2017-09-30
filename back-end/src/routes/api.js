import express from 'express';
import passport from 'passport';
import authenticated from '../config/authenticated';
import * as userController from '../controller/user';

const router = express.Router();

router.post('/signin', passport.authenticate('signin', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
}));
router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

export default router;