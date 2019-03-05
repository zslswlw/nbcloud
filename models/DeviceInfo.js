var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DeviceInfoSchema = new Schema({
    deviceID: String,
    devicePwd: String,
    deviceName: String,
    deviceAddr: String,
    deviceDetail: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});


module.exports = DeviceInfo = mongoose.model('devicesinfos', DeviceInfoSchema);