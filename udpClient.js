var dgram = require('dgram');

var clientSocket = dgram.createSocket('udp4');

var sd = require('silly-datetime');

var msg = "ID=86940503105546&pwd=123456";

var login = false;

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*35);
         res += chars[id];
     }
     return res;
}

function GetRandomNum(Min,Max)
{   
var max = Math.abs(Min*1000);   
var min = Math.abs(Max*1000)  
return Math.floor(Math.random()*(max-min+1)+min)/1000; 
//return(Min + Math.round(Rand * Range)); 
return(Min + Rand);   
}      

//clientSocket.send(msg, 0, msg.length, 18777, "localhost");

clientSocket.on('message', function(msgR, rinfo){
  console.log('recv %s(%d) from server\n', msg, msg.length);
  console.log(msgR.toString());
  if(msgR.toString() === "login"){
    console.log("开始发送信息！");
   login = true;
  }
});

clientSocket.on('error', function(err){
  console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
});

clientSocket.bind(5000);

function sendMsg(){
  if(login){
    let value = GetRandomNum(-0.85, -1.25);
    let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    msg = `volt: ${value}&time: ${time}`;
    clientSocket.send(msg, 0, msg.length, 18777, "localhost");
  } else{
    clientSocket.send(msg, 0, msg.length, 18777, "localhost");
  }
}
    

setInterval(()=>{
  sendMsg();
  console.log(`send message ${msg}`);
},5000);
