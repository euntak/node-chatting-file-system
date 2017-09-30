import dotenv from 'dotenv';

import http from 'http';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import mongoose from 'mongoose';
import connectMongoose from './config/connect-mongoose';
import routes from './routes';
import flash from 'express-flash';


dotenv.config();
require('./config/passport');
connectMongoose();

const app = express();
const port = process.env.PORT || 3000;

const MongoStore = connectMongo(session);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../front-end/src/views/'));

app.use(express.static(path.join(__dirname, '../../front-end/dist/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true, // 수정하지 않으면 저장하지 않는다
    saveUninitialized: true, // 저장 될 때 까지 세션을 만들지 않는다.
    cookie: {
        maxAge: 60 * 1000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60
    }) 
}));

// passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(routes);


http.createServer(app).listen(port, () => {
    console.log(`Express is running on PORT : ${port}`);
});

