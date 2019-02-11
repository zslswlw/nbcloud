var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DeviceInfoSchema = new Schema({
    deviceID: String,
    devicePwd: String,
    deviceName: String,
    deviceAddr: String,
    deviceDetail: String
});


module.exports = DeviceInfo = mongoose.model('devicesinfos', DeviceInfoSchema);