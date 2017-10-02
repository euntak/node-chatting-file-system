import { validUsername, findIndex } from '../util';
import Chat from '../model/chat';
import moment from 'moment';

let users = [];
let socketIds = [];
let sockets = {};

export function initialSocketConnection(io) {


    io.on('connection', socket => {
        console.log(socket.handshake.query);
        let username = socket.handshake.query.username;
        let currentUser = {
            id: socket.id,
            username: username
        };

        if (findIndex(users, currentUser.id) > -1) {
            console.log('[INFO] User ID is already connected!');
            socket.disconnect();
        } else if (!validUsername(currentUser.username)) {
            socket.disconnect();
        } else {
            console.log(`[INFO] User ${currentUser.username} connected!`);
            sockets[currentUser.id] = socket;
            socketIds[currentUser.username] = socket.id;
            users.push(currentUser);
            io.emit('userJoin', { username: currentUser.username });
            console.log(`[INFO] Total users: ${users.length}`);
        }

        socket.on('tic', () => {
            socket.emit('toc');
        });

        socket.on('disconnect', () => {
            if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
            delete socketIds[currentUser.username];
            console.log(`[INFO] User ${currentUser.username} disconnected!`);
            socket.broadcast.emit('userDisconnect', { username: currentUser.username });
        });

        socket.on('userChat', (data) => {
            let _username = data.username;
            let _message = data.message;
            let time = moment().format('YYYY-MM-DD HH:mm:ss');

            // save chat
            Chat.add({
                message: _message,
                username: _username,
                time: time,
                type: 'general',
                toUser: null,
                fromUser: null
            }).then(res => {
                console.log(`mongoDB Resut : ${res}`);
            });

            console.log(`[CHAT] [${time}] ${_username} : ${_message}`);
            socket.broadcast.emit('serverSendUserChat', { type: 'general', username: _username, message: _message });
        });

        socket.on('SendDirectMessage', (data) => {
            let _toUsername = data.toUser;
            let _fromUsername = data.fromUser;
            let _toUserGetSocketId = socketIds[_toUsername];

            let _message = data.message;
            let time = moment().format('YYYY-MM-DD HH:mm:ss');

            if (_toUserGetSocketId) {
                
                // save chat
                Chat.add({
                    message: _message,
                    username: _fromUsername,
                    time: time,
                    type: 'whisper',
                    toUser: _toUsername,
                    fromUser: _fromUsername
                }).then(res => {
                    console.log(`mongoDB Resut : ${res}`);
                });

                console.log(`[CHAT DIRECT] [${time}] FROM : ${_fromUsername}  TO : ${_toUsername} : ${_message}`);
                socket.broadcast.to(_toUserGetSocketId).emit('directMessage', { fromUser: _fromUsername, message: _message, toUser: _toUsername });
            }
            
            else socket.emit('errorDirectMessage', { message: `${_toUsername} is not connected! ` });

        });

        socket.on('getConnectedUserList', () => {
            socket.emit('userList', { users: Object.keys(socketIds) });
        })
    });
}