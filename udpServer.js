const dgram = require('dgram');
const serverSocket = dgram.createSocket('udp4');
const Wsocket = require('./config/socket');
const DeviceInfo = require('./models/DeviceInfo');
const User = require('./models/User');



const mongoose = require('mongoose');

const port = process.env.PORT || 18777;

// DB config
const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


serverSocket.on('message', (msg, rinfo) => {
    console.log('recv %s(%d bytes) from client %s:%d\n', msg.toString(), msg.length, rinfo.address, rinfo.port);
  
    //echo to client
    //serverSocket.send(msg, 0, msg.length, rinfo.port, rinfo.address);
    
    
    let deviceID = msg.toString().split("&")[0].split("=")[1];
    let devicePwd = msg.toString().split("&")[1].split("=")[1];

    //console.log({deviceID});
    DeviceInfo.find({ deviceID })
        .populate('user')
            .then(profile => {
                console.log(profile);
                if (!profile) {
                    errors.noprofile = '该设备用户的信息不存在~!';
                    return //res.status(404).json(errors);
                }
                //console.log(typeof(profile));
                //console.log(profile[0].user);
                Wsocket.init(
                    { user: profile[0] },
                    // message => {

                    // },
                    error => {
                        console.log(error);
                    }
                )
                let msgObj = {
                  courrent: profile[0]._id,
                  target: profile[0].user._id,
                  msg: msg.toString(),
                };
                Wsocket.send(msgObj);

        })
        .catch(err => console.log(err));
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
