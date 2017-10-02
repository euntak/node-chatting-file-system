import express from 'express';
import passport from 'passport';
import authenticated from '../config/authenticated';
import {getChattingLog} from '../controller/chat';

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

router.get('/chatlog/:skip/:limit', authenticated, getChattingLog);

export default router;