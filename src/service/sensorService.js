var sensorRepo = require('../repository/sensorData');
var gpsRepo = require('../repository/gpsData');
var rabbitmq = require('../utils/rabbitmq');
var _ = require('lodash');

exports.saveSensorData = function(req, callback){
    var sensorData = req.body.cached_data;
    sensorRepo.save(sensorData, function(err, sensordata){
        gpsRepo.searchGpsIdsByTimestamp(sensorData[0].timestamp, sensorData[sensorData.length -1].timestamp, function(err, gpsdata){
            if(gpsdata.length > 0) {
                var job = {
                    gpsPatch: _.map(gpsdata, '_id'),
                    sensorPatch: _.map(sensordata, '_id')
                };
                console.log('sending  data to queue after sensor api');

                rabbitmq.sendToQueue(job);
                callback(err,"successfully sent to queue from sensor");
                return;

            }
            callback(err,"saved but not sent");
        })
    })
};

