import mongoose, { Schema } from 'mongoose';

const Chat = new Schema({
    message: { type: String, required: true },
    username: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    toUser: { type: String },
    fromUser: { type: String }
});

Chat.statics.add = function(newChat) {
    const addChat = new this({
        message : newChat.message,
        username: newChat.username,
        time : newChat.time,
        type : newChat.type,
        toUser : newChat.toUser,
        fromUser : newChat.fromUser
    });

    return addChat.save();
}

Chat.statics.getChattingLogBySkipLimit = function (skip, limit) {
    return this.find({}).sort({time:1}).skip(skip).limit(limit);
}

export default mongoose.model('Chat', Chat);



