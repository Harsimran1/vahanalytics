var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = new Schema({
    timestamp: {},
    trip_id: {},
    ax: {},
    ay: {},
    az: {},
    azi: {},
    pit: {},
    rol: {},
    gyro: false
},{ strict: false });


var sensor = mongoose.model('sensor', sensorSchema);

module.exports = sensor;