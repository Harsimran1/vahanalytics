var mongoose = require('mongoose');
require('../models/gps')
var config = require('../config/config.js');
var Gps = mongoose.model('gps');

var db;

exports.init = function(){
    console.log('Connecting to MongoDB');
    mongoose.createConnection('mongodb://' + config.db_gps.host + '/' + config.db_gps.database,
        { server : { w : 1} });
    db = mongoose.connection;
    db.once('open', function () {
        console.log('MongoDB Connected!');
    });
};


exports.save = function(gpsData,callback){
    Gps.create(gpsData,function(err, data){
        if(err)
            console.log(err);
        else {
            console.log('saved gps data in mongodb')
            callback(err, data)
        }
    })

}

exports.searchGpsIdsByTimestamp = function(timestampStart, timestampEnd, callback){
    Gps.find({timestamp: { $gte: timestampStart, $lte: timestampEnd }},'_id', function(err, data){
        callback(err,data);
    })
}

exports.searchByIds = function(ids,callback ){
    Gps.find({'_id': { $in:ids}},function(err, data){
        if(err){
            console.log(err)
        }
        else{
            callback(err,data)
        }
    })
}

exports.deleteByIds = function(ids,callback ){
    Gps.remove({'_id': { $in:ids}},function(err, data){
        if(err){
            console.log(err)
        }
        else{
            callback(err,data)
        }
    })
}

