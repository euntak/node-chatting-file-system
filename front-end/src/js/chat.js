import $ from 'jquery';
import request from './request';
import moment from 'moment';
import io from 'socket.io-client';

export default class Chat {

    constructor(username) {
        this.$chatInput = $('#chatInput');
        this.$chatList = $('#chatList');
        this.$userList = $('.userList');
        this.username = username;
        this.socket = io({ query: "username=" + username });
        this.commands = {};

        this.setupSocket();
        this.setupUserList();
        this.setupChatLog();
        this.setupEvents();
    }

    setupUserList() {
        this.socket.emit('getConnectedUserList');
        this.socket.on('userList', (data) => {
            if (data.users.length > 1)
                data.users.forEach(user => {
                    if (this.username !== user) // 자기 자신 빼고 추가 
                        this.$userList.append(`<li data-id='${user}'>${user}</li>`)
                });
        }, this);
    }

    setupChatLog() {
        const skip = 0;
        const limit = 100;
        const options = {
            url: `/api/chatlog/${skip}/${limit}`
        }

        const chatLog = request(options);

        chatLog.then(data => {
            data.chatLog.forEach((chat, i) => {

                if (chat.type === 'whisper') {
                    // whisper chatting from ! 
                    if (this.username === chat.toUser) {
                        this.addChatLine({
                            username: this.username,
                            message: chat.message,
                            type: 'whisper',
                            time: moment(chat.time, "YYYY-MM-DD HH:mm:ss").fromNow(),
                            fromUser: chat.fromUser
                        });
                    }

                    // whisper chatting to ! 
                    if (this.username === chat.fromUser) {
                        this.addChatLine({
                            username: this.username,
                            message: chat.message,
                            type: 'whisper',
                            time: moment(chat.time, "YYYY-MM-DD HH:mm:ss").fromNow(),
                            toUser: chat.toUser
                        });
                    }
                }
                // general chatting
                else {
                    if (this.username === chat.username) {
                        this.addChatLine({
                            username: chat.username,
                            message: chat.message,
                            type: 'me',
                            time: moment(chat.time, "YYYY-MM-DD HH:mm:ss").fromNow()
                        });
                    }
                    else {
                        this.addChatLine({
                            username: chat.username,
                            message: chat.message,
                            type: 'friend',
                            time: moment(chat.time, "YYYY-MM-DD HH:mm:ss").fromNow()
                        });
                    }
                }
            });

        }, this).then(() => {
            this.setupChat();
        });

        chatLog.fail(err => {
            console.error(err);
        });
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
            this.$userList.children('li').each((i, item) => {
                if ($(item).text() === data.username) {
                    $(item).remove();
                }
            });

            this.addSystemLine(`<b>${data.username}</b> disconnected.`);
        });

        this.socket.on('userJoin', (data) => {
            const connectUser = data.username;
            this.$userList.append(`<li data-id='${connectUser}'>${connectUser}</li>`);
            this.addSystemLine(`<b>${connectUser}</b> joined.`);
        });

        // general chatting
        this.socket.on('serverSendUserChat', (data) => {
            this.addChatLine({
                username: data.username,
                message: data.message,
                type: 'friend',
                time: moment().format('LT')
            });
        });

        // whisper chatting
        this.socket.on('directMessage', (data) => {
            this.addChatLine({
                username: data.username,
                message: data.message,
                type: 'whisper',
                time: moment().format('LT'),
                fromUser: data.fromUser
            });
        });

        // whisper error handling
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
        this.$chatInput.on('keypress', key => {
            const ENTER_KEY = 13;
            key = key.which || key.keyCode;
            if (key === ENTER_KEY) {
                this.sendChat(this.$chatInput.val());
                this.$chatInput.val('');
            }
        });

        this.$chatInput.on('keyup', key => {
            const ESC_KEY = 27;
            key = key.which || key.keyCode;
            if (key === ESC_KEY) {
                this.$chatInput.val('');
            }
        });

        // userList click -> whisper ALL click -> general chat
        this.$userList.on('click', 'li', e => {
            const username = $(e.currentTarget).data('id');
            if (username.toLowerCase() === 'all') {
                this.$chatInput.val('');
            } else {
                this.$chatInput.val(`/w ${username} `);
            }

            this.$chatInput.focus();
        });
    }

    sendChat(text) {
        if (text) {
            if (text.indexOf('/') === 0) {
                let args = text.substring(1).split(' ');

                // direct message
                if (args[0] === 'w') {
                    let username = args[1];
                    // get pure message contain white space
                    let message = args.splice(2, args.length - 1).reduce((prev, next) => prev + ' ' + next, '');

                    this.commands[args[0]].callback(this.username, username, message);
                } else {
                    if (this.commands[args[0]]) {
                        this.commands[args[0]].callback(args.slice(1));
                    } else {
                        this.addSystemLine(`Unrecognized Command : ${text}, type /help for more info.`);
                    }
                }

            } else {
                this.socket.emit('userChat', { username: this.username, message: text });
                this.addChatLine({
                    username: this.username,
                    message: text,
                    type: 'me',
                    time: moment().format('LT')
                });
            }
        }
    }

    sendDirectMessage(fromUser, toUser, text) {
        this.socket.emit('SendDirectMessage', { toUser: toUser, fromUser: fromUser, message: text });

        this.addChatLine({
            message: text,
            time: moment().format('LT'),
            type: 'whisper',
            toUser: toUser,
        });
    }

    // chat = {username, message, type, time, toUser, fromUser}
    addChatLine(chat) {

        let chatHtml = `<li class=${chat.type}>`;

        if (chat.type === 'whisper') {
            if (chat.toUser) {
                chatHtml += `<b> [to] ${chat.toUser}</b>: ${chat.message} <span>${chat.time}</span>`;
            }

            if (chat.fromUser) {
                chatHtml += `<b> [from] ${chat.fromUser}</b>: ${chat.message} <span>${chat.time}</span>`;
            }

        } else {
            if (chat.type === 'me') chatHtml += `<b>${chat.username} (me) </b>: ${chat.message} <span>${chat.time}</span>`;
            else chatHtml += `<b>${chat.username}</b>: ${chat.message} <span>${chat.time}</span>`;
        }

        chatHtml += '</li>';
        this.$chatList.append(chatHtml);
        this.scolldown();
    }

    addSystemLine(message) {
        let systemHtml = `<li class=system>${message}</li>`;
        this.$chatList.append(systemHtml);
        this.scolldown();
    }

    registerCommand(name, description, callback) {
        this.commands[name] = {
            description: description,
            callback: callback
        };
    };

    printHelp() {
        for (let cmd in this.commands) {
            if (this.commands.hasOwnProperty(cmd)) {
                this.addSystemLine(`/${cmd} : ${this.commands[cmd].description}`);
            }
        }
    };

    checkLatency() {
        this.startPingTime = Date.now();
        this.socket.emit('tic');
    }

    scolldown() {
        this.$chatList.scrollTop(this.$chatList.prop('scrollHeight'));
    }
}