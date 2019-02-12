var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DeviceDataSchema = new Schema({
    "deviceID": String,
    "deviceData": String,
    "dataDir": String,
    "protocol": String,
    "date": String
});


module.exports = mongoose.model('devicedatas', DeviceDataSchema);