const dgram = require('dgram');
const serverSocket = dgram.createSocket('udp4');
const Wsocket = require('./config/socket');
const axios = require('axios');
const jwt_decode = require('jwt-decode');

const port = process.env.PORT || 18777;

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
    if (global.token)
        config.headers.Authorization = global.token;
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
  return response;
}, error => {
  // 错误提醒
  //console.log(error.response.data);
  console.log(error);

  const { status } = error.response
  if (status == 401) {
      console.log('token值无效，请重新登录');
      // 清除token
      global.token = "";
      global.isLogin = false;

      // 页面跳转
      //router.push('/login')
  }

  return Promise.reject(error)
});

function getToken(deviceID, devicePwd){
  return axios.post('http://localhost:3000/api/deviceinfos/connect', { deviceID, devicePwd })
      .then(res => {
        const { token } = res.data;
        return token;
      })
}

function getDeInfo(deviceID, devicePwd){
  return axios.get('http://localhost:3000/api/deviceinfos/devuser', { params: { deviceID, devicePwd } })
      .then(res => {
        deInfo = res.data[0];
        return deInfo;
      })
}

function getMessage(device, user){   
    axios.get(`http://localhost:3000/api/msgprofiles/msg/${device._id}`)
      .then(res => {
        console.log(res.data[0]);
        let result = res.data.filter(data => {
          return data.target._id == user._id;
        });

        if (result.length > 0) {
          return result[0].message;
        }
    }
  )
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

  function saveMsg(user, device, msgList, msgList2) {
    // 保存来自设备的消息
    let message1 = {
      target: {
        avatar: user.avatar, 
        name: user.Name,
        _id: user._id
      },
      count: 0,
      message: msgList,
      user_id: device._id
    };
    axios.post("/api/msgprofiles/add", message1)
      .then(res => (console.log("保存了本地消息1")));
    // 保存发送给设备的消息
    let message2 = {
      target: {
        avatar: device.avatar, 
        name: device.deviceName,
        _id: device._id
      },
      count: 0,
      message: msgList2,
      user_id: user._id
    };
    axios.post("/api/msgprofiles/add", message2)
      .then(res => (console.log(保存了本地消息1)));
  }

  function isEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  }



serverSocket.on('message', (msg, rinfo) => {
    console.log('recv %s(%d bytes) from client %s:%d\n', msg.toString(), msg.length, rinfo.address, rinfo.port);
    const reg = /ID=([0-9]{15})&pwd=.+/;
    var messageList1 = [];
    var messageList2 = [];
    if(reg.test(msg.toString()) && !global.isLogin){
      let deviceID = msg.toString().split("&")[0].split("=")[1];
      let devicePwd = msg.toString().split("&")[1].split("=")[1];
      axios.all([getToken(deviceID, devicePwd), getDeInfo(deviceID, devicePwd)])
        .then(axios.spread((token, deInfo)  => {
          const device = jwt_decode(token);
          global.token = token;
          global.isLogin = !isEmpty(device);
          global.device = device;
          global.user = deInfo.user;
          messageList1 = getMessage(deInfo, deInfo.user);
          messageList2 = getMessage(deInfo.user, deInfo);
          Wsocket.init(
            { user: device },
            message => {
    
            },
            error => {
                console.log("连接有问题");
            }
          );
          serverSocket.send("login", 0, msg.length, rinfo.port, rinfo.address);   
        })
      )
      //return;
    } else if(global.isLogin && !reg.test(msg.toString())){
      let msgObj = {
        current: global.device._id,
        target: global.device.user,
        msg: msg.toString(),
      };
      let msgList1 = messageList1.push({ msg: msg.toString(), soure: "self"});
      let msgList2 = messageList2.push({ msg: msg.toString(), soure: "other"});
      saveMsg(global.device.user, global.device._id, msgList1, msgList2);
      

      Wsocket.send(msgObj);
    } else if(!global.isLogin){
      console.log("没有注册!");
    } else {
      console.log("已注册!");
    }
});
  
  //    err - Error object, https://nodejs.org/api/errors.html
serverSocket.on('error', function(err){
  console.log('error, msg - %s, stack - %s\n', err.message, err.stack);
});

serverSocket.on('listening', function(){
  console.log(`echo server is listening on port ${port}`);
});


serverSocket.bind(port);