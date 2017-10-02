import $ from 'jquery';
import Chat from './Chat';

class Client {
    constructor () {
        this.$joinBtn = $('#startButton');
        this.$chatInput = $('#chatInput');
        this.username = this.$joinBtn.data('id');
        this.bindEvents();
    }

    bindEvents() {
        this.$joinBtn.on('click', e => {
            this.startChat();
        });
    }

    startChat() {
        this.$joinBtn.hide()
        this.$chatInput.show();
        this.chat = new Chat(this.username);
    }
}

window.onload = () => {
    new Client();
};