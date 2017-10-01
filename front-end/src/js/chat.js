import $ from 'jquery';
import io from 'socket.io-client';

export default class Chat {
    constructor(username) {
        this.chatInput = document.getElementById('chatInput');
        this.chatList = document.getElementById('chatList');
        this.$userList = $('.userList');
        this.username = username;
        this.socket = io({query: "username=" + username});
        this.commands = {};

        this.setupSocket();
        this.setupUserList();
        this.setupChat();
        this.setupEvents();
    }

    setupUserList() {
        this.socket.emit('getConnectedUserList');
        this.socket.on('userList', (data) => {
            if(data.users.length > 1)
                data.users.forEach(user => {
                    if(this.username !== user) // 자기 자신 빼고 추가 
                        this.$userList.append(`<li data-id='${user}'>${user}</li>`)
                });
        }, this);
    }

    setupSocket() {
        this.socket.on('toc', () => {
            this.latency = Date.now() - this.startPingTime;
            this.addSystemLine('Ping: ' + this.latency + 'ms');
        });

        this.socket.on('connect_failed', () => {
            this.socket.close();
        });

        this.socket.on('disconnect', () => {
            this.socket.close();
        });

        this.socket.on('userDisconnect', (data) => {
            this.$userList.children('li').each( (i, item) => {
                if($(item).text() === data.username) {
                    $(item).remove();
                }
            });

            this.addSystemLine('<b>' + (data.username.length < 1 ? 'Anon' : data.username) + '</b> disconnected.');
        });

        this.socket.on('userJoin', (data) => {
            const connectUser = (data.username.length < 1 ? 'Anon' : data.username);
            this.$userList.append(`<li data-id='${connectUser}'>${connectUser}</li>`);
            this.addSystemLine('<b>' + connectUser + '</b> joined.');
        });

        // 일반 채팅
        this.socket.on('serverSendUserChat', (data) => {
            this.addChatLine(data.username, data.message, 'friend');
        });

        // 귓속말 
        this.socket.on('directMessage', (data) => {
            this.addChatLine(null, data.message, 'whisper', null, data.fromUser);
        });

        // 귓속말 에러 핸들링
        this.socket.on('errorDirectMessage', (data) => {
            this.addSystemLine(data.message);
        })
    }

    setupChat() {
        this.registerCommand('ping', 'Check your latency.', this.checkLatency.bind(this));
        this.registerCommand('help', 'Information about the chat commands.', this.printHelp.bind(this));
        this.registerCommand('w', 'Send Direct message to User', this.sendDirectMessage.bind(this));

        this.addSystemLine('Connected to the chat!');
        this.addSystemLine('Type <b>/help</b> for a list of commands.');
    }

    setupEvents() {
        this.chatInput.addEventListener('keypress', (key) => {
            key = key.which || key.keyCode;
            if (key === 13) {
                this.sendChat(this.chatInput.value);
                this.chatInput.value = '';
            }
        });

        this.chatInput.addEventListener('keyup', (key) => {
            key = key.which || key.keyCode;
            if (key === 27) {
                this.chatInput.value = '';
            }
        });
    }

    sendChat(text) {
        if (text) {
            if (text.indexOf('/') === 0) {
                let args = text.substring(1).split(' ');

                // direct message
                if(args[0] === 'w') {
                    let username = args[1];
                    let message = args.splice(2, args.length-1).reduce( (prev, next) => prev + ' ' + next, '');

                    console.log(`FROM : ${this.username} TO : ${username} , MESSAGE : ${message}`);
                    this.commands[args[0]].callback(this.username, username, message);
                } else {
                    if (this.commands[args[0]]) {
                        this.commands[args[0]].callback(args.slice(1));
                    } else {
                        this.addSystemLine('Unrecognized Command: ' + text + ', type /help for more info.');
                    }
                }

            } else {
                this.socket.emit('userChat', {username: this.username, message: text});
                this.addChatLine(this.username, text, 'me');
            }
        }
    }

    sendDirectMessage(fromUser, toUser, text) {
        this.socket.emit('SendDirectMessage', {toUser: toUser, fromUser: fromUser, message: text});
        this.addChatLine(null, text, 'whisper', toUser, null);
    }

    addChatLine(name, message, me, toUser = null, fromUser = null) {
        let newline = document.createElement('li');

        newline.className = me

        if(me === 'whisper') {
            if(toUser) {
                newline.innerHTML = '<b> [to] ' + ((toUser.length < 1) ? 'Anon' : toUser) + '</b>: ' + message;    
            }

            if(fromUser) {
                newline.innerHTML = '<b> [from] ' + ((fromUser.length < 1) ? 'Anon' : fromUser) + '</b>: ' + message;
            }
            
        } else {
            if(me === 'me') newline.innerHTML = '<b>' + ((name.length < 1) ? 'Anon' : name) + ' (me) </b>: ' + message;
            else newline.innerHTML = '<b>' + ((name.length < 1) ? 'Anon' : name) + '</b>: ' + message;
        }
        

        this.appendMessage(newline);
    }

    addSystemLine(message) {
        let newline = document.createElement('li');

        newline.className = 'system';
        newline.innerHTML = message;

        this.appendMessage(newline);
    }

    appendMessage(node) {
        this.chatList.appendChild(node);
    };

    registerCommand(name, description, callback) {
        this.commands[name] = {
            description: description,
            callback: callback
        };
    };

    printHelp() {
        for (let cmd in this.commands) {
            if (this.commands.hasOwnProperty(cmd)) {
                this.addSystemLine('/' + cmd + ': ' + this.commands[cmd].description);
            }
        }
    };

    checkLatency() {
        this.startPingTime = Date.now();
        this.socket.emit('tic');
    }
}