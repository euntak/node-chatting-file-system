import mongoose, { Schema } from 'mongoose';

const User = new Schema({
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    salt: { type: String }
});

User.statics.add = function(newUser) {
    const registerUser = new this({
        username: newUser.username,
        password: newUser.password,
        salt: newUser.salt
    });

    return registerUser.save();
}

User.statics.findUserByName = function(username) {
    return this.findOne({ 'username' : username });
}

User.statics.checkPassword = function({ username, password }) {
    return this.findOne({ 'username' : username, 'password' : password });
}

export default mongoose.model('User', User);



