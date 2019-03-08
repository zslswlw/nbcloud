var dgram = require('dgram');

var clientSocket = dgram.createSocket('udp4');

var msg = "ID=869405031055488&pwd=123456"

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*35);
         res += chars[id];
     }
     return res;
}

//clientSocket.send(msg, 0, msg.length, 18777, "localhost");

clientSocket.on('message', function(msgR, rinfo){
  console.log('recv %s(%d) from server\n', msg, msg.length);
  console.log(msgR.toString());
  if(msgR.toString() === "login"){
    console.log("开始发送信息！");
    msg = generateMixed(30);
  }
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
},5000);
