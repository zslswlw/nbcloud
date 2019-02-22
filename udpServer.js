const dgram = require('dgram');
const serverSocket = dgram.createSocket('udp4');
const Wsocket = require('./config/socket');
const DeviceInfo = require('./models/DeviceInfo');
const User = require('./models/User');
const msgprofiles = require('./models/MsgProfile');
const axios = require('axios');



//const mongoose = require('mongoose');

const port = process.env.PORT || 18777;

// // DB config
// const db = require('./config/keys').mongoURI;
// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

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
    axios.get('http://localhost:3000/api/profiles/test').then(res => console.log(res.data));
    //echo to client
    //serverSocket.send(msg, 0, msg.length, rinfo.port, rinfo.address);
    
    
    // let deviceID = msg.toString().split("&")[0].split("=")[1];
    // let devicePwd = msg.toString().split("&")[1].split("=")[1];
    
    // let deviceProfile = null;
    // let messageList = [];
    // let messageList2 = [];


    // DeviceInfo.find({ deviceID }, { devicePwd })
    //     .populate('user')
    //         .then(profile => {
    //             console.log(profile);
    //             if (!profile) {
    //                 errors.noprofile = '该设备用户的信息不存在~!';
    //                 return //res.status(404).json(errors);
    //             }

    //             deviceProfile = profile[0];
    //             //console.log(typeof(profile));
    //             //console.log(profile[0].user);
    //             Wsocket.init(
    //                 { user: profile[0] },
    //                 // message => {

    //                 // },
    //                 error => {
    //                     console.log(error);
    //                 }
    //             )
    //             let msgObj = {
    //               current: profile[0]._id,
    //               target: profile[0].user._id,
    //               msg: msg.toString(),
    //             };
    //             let message = {
    //               target: {
    //                 avatar: profile[0].user.avatar,
    //                 mame: profile[0].user.name,
    //                 _id: profile[0].user._id,
    //               },
    //               count: 0,
    //               message:  ,
    //               user_id: profile[0]._id,
    //             }
    //             Wsocket.send(msgObj);

        //})
        //.catch(err => console.log(err));
        //console.log({ deviceID: ID}, { devicePwd: PWD})
    
    });
  
  //    err - Error object, https://nodejs.org/api/errors.html
  serverSocket.on('error', function(err){
    console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
  });
  
  serverSocket.on('listening', function(){
    console.log(`echo server is listening on port ${port}`);
  })


serverSocket.bind(port);
