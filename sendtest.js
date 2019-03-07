var dgram = require('dgram');

var clientSocket = dgram.createSocket('udp4');

var msg = toString(Date.now);

//clientSocket.send(msg, 0, msg.length, 18777, "localhost");

clientSocket.on('message', function(msg, rinfo){
  console.log('recv %s(%d) from server\n', msg, msg.length);
});

clientSocket.on('error', function(err){
  console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
});

clientSocket.bind(5000);

function sendMsg(){
    clientSocket.send(msg, 0, msg.length, 18777, "localhost");
}

setInterval(()=>{
    sendMsg();
    console.log("send message");
},10000);
