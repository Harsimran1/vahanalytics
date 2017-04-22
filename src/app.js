var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(require('express-domain-middleware'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
var sensorData = require('./repository/sensorData');
var gpsData = require('./repository/gpsData');
var vehicleData = require('./api/vehicleData');
var rabbitmq = require('./utils/rabbitmq');

sensorData.init();
gpsData.init();
rabbitmq.connectBrokerAndConsume();

app.post('/gps', vehicleData.handleGpsData);
app.post('/sensor', vehicleData.handleSensorData);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
