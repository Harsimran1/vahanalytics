var gpsRepo = require('../repository/gpsData');
var sensorRepo = require('../repository/sensorData');
var rabbitmq = require('../utils/rabbitmq')
var _ = require('lodash');


exports.handleGpsDate = function(req,callback){
    var gpsData = req.body.cached_data;
    gpsRepo.save(gpsData,function(err,gpsdata){

        sensorRepo.searchSensorIdsByTimestamp(gpsData[0].timestamp, gpsData[gpsData.length -1].timestamp, function(err, sensordata){
            if(sensordata.length > 0) {
                var job = {
                    gpsPatch: _.map(gpsdata, '_id'),
                    sensorPatch: _.map(sensordata, '_id')
                };
                console.log('sending  data to queue after gps api');
                rabbitmq.sendToQueue(job);
            }
            callback(err,gpsdata);
        })
    })
}