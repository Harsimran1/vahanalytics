var mongoose = require('mongoose');
require('../models/sensor')
var config = require('../config/config.js');
var Sensor = mongoose.model('sensor');


var db;

exports.init = function(){
    console.log('Connecting to MongoDB');
    mongoose.connect('mongodb://' + config.db_sensor.host + '/' + config.db_sensor.database,
        { server : { w : 1} });
    db = mongoose.connection;
    db.once('open', function () {
        console.log('MongoDB Connected!');
    });
};

exports.save = function(sensorData,callback){
    Sensor.create(sensorData,function(err, data){
        if(err)
            console.log(err);
        else {
            console.log('saved sensor data in mongodb')
            callback(err, data)
        }
    })
}

exports.searchSensorIdsByTimestamp = function(timestampStart, timestampEnd, callback){
    Sensor.find({timestamp: { $gte: timestampStart, $lte: timestampEnd }},'_id', function(err, data){
        callback(err,data);
    })
}

exports.searchByIds = function(ids,callback ){
    Sensor.find({'_id': { $in:ids}},function(err, data){
        if(err){
            console.log(err)
        }
        else{
            callback(err,data)
        }
    })
}

exports.deleteByIds = function(ids,callback ){
    Sensor.remove({'_id': { $in:ids}},function(err, data){
        if(err){
            console.log(err)
        }
        else{
            callback(err,data)
        }
    })
}