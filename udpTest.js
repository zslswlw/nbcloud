const DeviceInfo = require('./models/DeviceInfo');
const User = require('./models/User');

const mongoose = require('mongoose');

// DB config
const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



    DeviceInfo.find().then(profile => {
            console.log("进来了！");
            console.log(profile);
            if (!profile) {
                errors.noprofile = '该设备用户的信息不存在~!';
                return //res.status(404).json(errors);
            }          
        })
        .catch(err => console.log(err));

        console.log("出来了！");

        User.find().then(profile => {
          console.log(profile);
        })

    
  
  