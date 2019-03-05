const dgram = require('dgram');
const serverSocket = dgram.createSocket('udp4');
const Wsocket = require('./config/socket');
const axios = require('axios');

const mongoose = require('mongoose');

const DeviceInfo = require('./models/DeviceInfo');
const User = require('./models/User');

const port = process.env.PORT || 18777;

function getToken(deviceID, devicePwd){
  console.log(14);
  return axios.post('http://localhost:3000/api/deviceinfos/connect', { deviceID, devicePwd })
      // .then(res => {
      //   token = res.data.token;
      //   return token;
      // })
}

function getDeInfo(deviceID, devicePwd){
  console.log(23);
  return axios.post('http://localhost:3000/api/deviceinfos/devuser', { deviceID, devicePwd }
      )
      // .then(res => {
      //   deInfo = res.data[0];
      //   console.log(deInfo);
      //   return deInfo;
      // })
}

function getMessage(user, token){   
  const options = {
    method: 'get',
    headers: { 'content-type': 'application/x-www-form-urlencoded' ,
                'Authorization': token 
              },
    url: `http://localhost:3000/api/msgprofiles/msg/${user._id}`
  };
    axios(options)
    .then(res => {
      console.log(res.data);
      // let result = res.data.filter(data => {
      //   return data.target._id == deInfo._id;
      });
      // if(result.length > 0){
      //   _messageList = result[0].message;
      // }
    //})
    //.catch(err => console.log(err));
}

function sendMessage(device, user, ws, msg, msglist, msglist2) {
    // console.log(this.msgValue);
    // 需要发送的消息对象
    const msgObj = {    
      target: user._id,
      current: device.id,
      msg: msg
    };

    WSocket.send(msgObj);

    // 本地客户端显示
    msglist.push({
      msg: msg,
      source: "self"
    });

    msglist2.push({
      msg: msg,
      source: "other"
    })

    // 保存消息
    this.saveMsg();

  }

  function saveMsg(device, user, msglist, msglist2) {
    // 保存来自设备的消息
    let message1 = {
      target: {
        avatar: user.avatar, 
        name: user.deviceName,
        _id: user._id
      },
      count: 0,
      message: msglist,
      user_id: device.id
    };
    this.$axios
      .post("/api/msgprofiles/add", message1)
      .then(res => (this.msgValue = ""));
    // 保存发送给设备的消息
    let message2 = {
      target: {
        avatar: device.avatar, 
        name: device.name,
        _id: device._id
      },
      count: 0,
      message: msglist2,
      user_id: user._id
    };
    this.$axios
      .post("/api/msgprofiles/add", message2)
      .then(res => (this.msgValue = ""));
  }



serverSocket.on('message', (msg, rinfo) => {
    console.log('recv %s(%d bytes) from client %s:%d\n', msg.toString(), msg.length, rinfo.address, rinfo.port);
    
    let deviceID = msg.toString().split("&")[0].split("=")[1];
    let devicePwd = msg.toString().split("&")[1].split("=")[1];
    
    let deInfo = {};
    let user = {}
    let messageList = [];
    let messageList2 = [];
    var token = {};
    //console.log(getToken(deviceID, devicePwd));
    //console.log(getDeInfo(deviceID, devicePwd));
    
    axios.all([getToken(deviceID, devicePwd), getDeInfo(deviceID, devicePwd)]).then(axios.spread(function (token, deInfo) {
      // 两个请求现在都执行完成
      //axios.defaults.headers.common['Authorization'] = token;
      console.log(deInfo);
      console.log(token);
      //getMessage(token, deInfo.user_id);
    }))
                
                // Wsocket.init(
                //     { user: profile[0] },
                //     // message => {

                //     // },
                //     error => {
                //         console.log(error);
                //     }
                // )
                // let msgObj = {
                //   current: profile[0]._id,
                //   target: profile[0].user._id,
                //   msg: msg.toString(),
                // };
                // let message = {
                //   target: {
                //     avatar: profile[0].user.avatar,
                //     mame: profile[0].user.name,
                //     _id: profile[0].user._id,
                //   },
                //   count: 0,
                //   message:  ,
                //   user_id: profile[0]._id,
                // }
                // Wsocket.send(msgObj);

        // })
        .catch(err => console.log(err));
    
    });
  
  //    err - Error object, https://nodejs.org/api/errors.html
  serverSocket.on('error', function(err){
    console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
  });
  
  serverSocket.on('listening', function(){
    console.log(`echo server is listening on port ${port}`);
  })


serverSocket.bind(port);
