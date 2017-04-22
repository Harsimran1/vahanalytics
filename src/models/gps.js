var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gpsSchema = new Schema({
    company_id: {},
    driver_id: {},
    trip_id: {},
    timestamp: {},
    battery: {},
    android_id: {},
    app_version: {},
    lat: {},
    lng: {},
    accuracy: {}
});

var gps = mongoose.model('gps', gpsSchema);

module.exports = gps;