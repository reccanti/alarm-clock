var http = require('http');
var socketio = require('socket.io');

module.exports = function (options) {
    var io = socketio();
    
    io.on('connection', function (socket) {
        socket.on('talking', function (data) {
            console.log ('Received data from ' + data.name + '@' + data.id + '. Sending to others...');
            socket.emit('listening', data);
        });
    });
    
    return io;
};