var amqp = require('amqplib/callback_api');
var config = require('../config/config.js');
var gpsRepo = require('../repository/gpsData');
var sensorRepo = require('../repository/sensorData');
var request = require('request');
var connection;
var QUEUE_NAME = 'gps_and_sensor_job';



    exports.connectBrokerAndConsume = function() {
    console.log('Connecting to RabbitMQ');
    amqp.connect(config.rabbitmq.host, function(err, conn) {
        if(err){
            console.log('Error connecting rabbitmq')
        }
        else {
            connection = conn;
            console.log('RabbitMQ connected');
            consume(QUEUE_NAME);
        }
    });
};

exports.sendToQueue = function(msg){
    if (connection !== undefined) {
        connection.createChannel( function(err, ch){
            if(err){
                Logger.error(err);
                return;
            }
        ch.assertQueue(QUEUE_NAME, {durable: true} );
        var payload = JSON.stringify(msg);
        ch.sendToQueue(QUEUE_NAME, new Buffer(payload), {persistent: true});
        ch.close();
    });
    }
};


var consume = function() {
    if (connection !== undefined) {
        connection.createChannel(function (err, ch) {
            ch.assertQueue(QUEUE_NAME, {durable: true} );
            ch.prefetch(1);
            ch.consume(QUEUE_NAME, function (msg) {
                console.log(" [x] Received %s", JSON.parse(msg.content.toString()).gpsPatch);
                var gpsIds = JSON.parse(msg.content.toString()).gpsPatch;
                var sensorIds = JSON.parse(msg.content.toString()).sensorPatch;
                var job = {};

                gpsRepo.searchByIds(gpsIds, function(err,gpsdata){
                    if(err){
                        return;
                    }
                    else{
                        sensorRepo.searchByIds(sensorIds, function(err, sensordata){
                            if(err){

                            }
                            else{
                                var job = {
                                    gpsPatch: gpsdata,
                                    sensorPatch: sensordata
                                };

                                request({
                                    url:config.analyticsApiUrl,
                                    method: 'POST',
                                    json: job
                                },function (error, response){
                                    if(error){
                                       console.log(error);
                                    }
                                    if (response.statusCode === 200 && response.body !== undefined) {
                                        gpsRepo.deleteByIds(gpsIds,function(err, data){
                                            if(err)
                                                console.log(err);
                                            else
                                                console.log('successfully deleted gps patch')
                                        });
                                        sensorRepo.deleteByIds(sensorIds,function(err, data){
                                            if(err)
                                                console.log(err);
                                            else
                                                console.log('successfully deleted sensor patch')
                                        });
                                        ch.ack(msg,function(err,data){
                                            console.log('acknowledge');
                                        });
                                    }
                                    else {
                                        callback('error tracking');
                                    }
                                });
                            }
                        })
                    }
                })
            }, {noAck: false,durable:true});
        })
    }
};