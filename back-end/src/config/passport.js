import passport from 'passport';
import { passwordGenerator, passwordComparison } from './crypto';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../model/user';


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user, err) => {
        done(err, user);
    });
});

passport.use(
    'signup',
    new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    },
        (req, username, password, done) => {
            User.findUserByName(username)
                .then(user => {
                    if (user) {
                        req.flash('ErrorMessage', 'Already Exsist UserName');
                        return done(null, false);
                    }
                    return passwordGenerator(password);
                })
                .then(hash => { // password hashing + salt
                    const newUser = {
                        username,
                        salt: hash.salt,
                        password: hash.password
                    };

                    return User.add(newUser);
                })
                .then(user => {
                    return done(null, {
                        _id: user._id,
                        username: user.username
                    });
                });
        }
    )
);

passport.use(
    'signin',

    new LocalStrategy({
        username: 'username',
        password: 'password',
        passReqToCallback: true
    },
        (req, username, password, done) => {
            User.findUserByName(username)
                .then(user => {
                    if (!user) {
                        req.flash('ErrorMessage', 'Incorrect username.');
                        return done(null, false);
                    }
                    return passwordComparison(user, password);
                })
                .then(loginedUser => {
                    return done(null, {
                        _id: loginedUser._id,
                        username: loginedUser.username
                    });

                })
                .catch(err => {
                    req.flash('ErrorMessage', 'Incorrect password.');
                    return done(null, false);
                });
        }
    )
);
