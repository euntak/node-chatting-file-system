import $ from 'jquery';
import io from 'socket.io-client';
const socket = io();

$(function () {    
    
    $(".mytext").on("keyup", function(e){
        if (e.which == 13){
            var text = $(this).val();
            if (text !== ""){
                console.log(text);
                socket.emit('chat message', text);
                $(this).val('');    
            }
        }
    });

    // client - to - client
    socket.on('chat message', function (msg) {
        $('.messages').append($('<li>').text(msg));
    });

});