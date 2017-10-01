import express from 'express';
import authenticated from '../config/authenticated';

const router = express.Router();

router.get('/', authenticated, function(req, res) {
    res.render('index', { user: req.user });
});

router.get('/chat', authenticated, function(req, res) {
    res.render('chat', { user: req.user });
})

router.get('/signin', function(req, res) {
    res.render('signin', {ErrorMessage: req.flash('ErrorMessage')});
});

router.get('/signup', function(req, res) {
    res.render('signup', {ErrorMessage: req.flash('ErrorMessage')});
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

export default router;