var socket = io();
socket.connect('http://localhost:8080/');

var messages = document.getElementById('messages');

socket.on('news', function(msg) {
  console.log(msg);
  if (msg != 'undefined' && msg != 'timeout') {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});
