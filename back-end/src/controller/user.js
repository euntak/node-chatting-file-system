import User from '../model/user';
import passport from 'passport';

export const registerNewUser = (req, res, next) => {

    passport.authenticate('signup', (err, user, info) => {
        var error = err || info;
        if (error) return res.status(401).json(error);
        if (!user) return res.status(404).json({ message: 'Something went wrong, please try again.' });

        // session register
        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ user });
        });

    })(req, res, next);
}


export const login = (req, res, next) => {

    passport.authenticate('signin', {
        successRedirect: '/',
        failureRedirect: '/login'
    },
        (err, user, info) => {

            var error = err || info;
            if (error) return res.status(401).json(error);
            if (!user) return res.status(401).json({
                result: {
                    message: 'User Login Failure',
                    code: 0
                }
            });

        })(req, res, next);

}

export const logout = (req, res, next) => {
    req.logout();
    req.session.destroy();
}