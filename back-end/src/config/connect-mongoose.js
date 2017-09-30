import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

function connectionMongoDB() {
    const DB_URL = process.env.DB_URL;
    const DB_NAME = process.env.DB_NAME;

    mongoose.Promise = global.Promise;

    return mongoose.connect(DB_URL, { useMongoClient: true })
        .then(() => console.log(`Connected to ${DB_NAME}`))
        .then(() => mongoose.connection)
        .catch(error => console.error(error));
}

export default connectionMongoDB;
