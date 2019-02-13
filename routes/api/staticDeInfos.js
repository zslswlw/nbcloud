const express = require('express');
const router = express.Router();

const passport = require('passport');

const DeviceInfo = require('../../models/DeviceInfo');
const DeviceData = require('../../models/DeviceData');

// @route  GET api/staticDeinfo
// @desc   返回平台数据概要接口
// @access private
router.get(
    '/',
    passport.authenticate('jwt', {session : false}),
    (req, res) => {
      infolist = {};
      get_device_list((key, value) => {
        infolist[key] = value;
        //console.log(infolist);
        if (Object.keys(infolist).length == 3) {
            res.json(infolist);
        }
      })
    } 
);
    //res.json({ msg: 'profile works' });
function get_device_list(callback) {
  //取设备个数
  DeviceInfo.find().count().then(count => {
    callback("deNum", count);
  })
  .catch(err => console.log('Error:' + err));

  //取上行数据条数
  DeviceData.find({"dataDir":'上行数据'}).count().then(count => {
    callback("receNum", count);
  })
  .catch(err => console.log('Error:' + err));
  

  //取下行数据条数
  DeviceData.find({"dataDir":'下行数据'}).count().then(count => {
    callback("tranNum", count);
  })
  .catch(err => console.log('Error:' + err)); 
}

module.exports = router;