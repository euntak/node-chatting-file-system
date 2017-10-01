import Chat from './Chat';
// import {validusername} from '../../shared/util'

class Client {
    constructor () {
        let btn = document.getElementById('startButton'),
            userNameInput = document.getElementById('userNameInput');
        
        btn.onclick = () => {
            this.startChat(userNameInput.value);
        };

        userNameInput.addEventListener('keypress', (e) => {
            let key = e.which || e.keyCode;

            if (key === 13) {
                this.startChat(userNameInput.value);
            }
        });
    }

    startChat(username) {
        let usernameErrorText = document.querySelector('#startMenu .input-error');

        if (username) {
            usernameErrorText.style.opacity = 0;
            this.username = username;
        } else {
            usernameErrorText.style.opacity = 1;
            return false;
        }

        this.chat = new Chat(this.username);

        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        // document.getElementById('userList').style.display = 'flex';
    }
}

window.onload = () => {
    new Client();
};