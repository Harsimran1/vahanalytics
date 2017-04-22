var dummyData = require('../constants/dummyData');
var sensorService = require('../service/sensorService');
var gpsService = require('../service/gpsService');

exports.handleGpsData = function(req,res){
    // req.body = dummyData.gpsData;
    gpsService.handleGpsDate(req, function(err, data){
        if(err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    })
};

exports.handleSensorData = function(req, res){
    // req.body = dummyData.sensorData;
    sensorService.saveSensorData(req, function(err, data){
        if(err){
            res.send(err);
        }
        else{
            res.send(data);
        }
    })
};