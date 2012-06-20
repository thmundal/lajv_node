var io = require("socket.io");

process.swank = _swank;

var model = require("./model").model;

process.on('uncaughtException', function (err) {
             console.log('Caught exception: ' + err.stack);
             _swank.output('Caught exception: ' + err.stack);
           });