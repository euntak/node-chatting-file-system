import {validUsername, findIndex} from '../util';

let users = [];
let socketIds = [];
let sockets = {};

export function initialSocketConnection (io) {
    

    io.on('connection', socket => {
        console.log(socket.handshake.query);
        let username = socket.handshake.query.username;
        let currentUser = {
            id: socket.id,
            username: username
        };

        if (findIndex(users, currentUser.id) > -1) {
            console.log('[INFO] User ID is already connected, kicking.');
            socket.disconnect();
        } else if (!validUsername(currentUser.username)) {
            socket.disconnect();
        } else {
            console.log('[INFO] User ' + currentUser.username + ' connected!');
            sockets[currentUser.id] = socket;
            socketIds[currentUser.username] = socket.id;
            users.push(currentUser);
            io.emit('userJoin', {username: currentUser.username});
            console.log('[INFO] Total users: ' + users.length);
        }

        // socket.on('chat message', msg => {
        //     io.emit('chat message', msg);
        // });

        socket.on('tic', () => {
            socket.emit('toc');
        });
    
        socket.on('disconnect', () => {
            if (findIndex(users, currentUser.id) > -1) users.splice(findIndex(users, currentUser.id), 1);
            delete socketIds[currentUser.username];
            console.log('[INFO] User ' + currentUser.username + ' disconnected!');
            socket.broadcast.emit('userDisconnect', {username: currentUser.username});
        });

        socket.on('userChat', (data) => {
            let _username = data.username;
            let _message = data.message;
            let date = new Date();
            let time = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);
    
            console.log('[CHAT] [' + time + '] ' + _username + ': ' + _message);
            socket.broadcast.emit('serverSendUserChat', {type:'general', username: _username, message: _message});
        });

        socket.on('SendDirectMessage', (data) => {
            let _toUsername = data.toUser;
            let _fromUsername = data.fromUser;
            let _toUserGetSocketId = socketIds[_toUsername];

            let _message = data.message;
            let date = new Date();
            let time = ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2);

            console.log(`[CHAT DIRECT] [${time}] FROM : ${_fromUsername}  TO : ${_toUsername} : ${_message}`);
            if(_toUserGetSocketId)
                socket.broadcast.to(_toUserGetSocketId).emit('directMessage', { fromUser: _fromUsername, message: _message, toUser: _toUsername });
            else 
                socket.emit('errorDirectMessage', { message: `${_toUsername} is not connected! `});
            
        });

        socket.on('getConnectedUserList', () => {
            // 자기 자신 빼고 보내야 됨
            // const connectedUser = socketIds[] 
            // Object.keys(socketIds);

            socket.emit('userList', { users: Object.keys(socketIds) });
        })
    });
}