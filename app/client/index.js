var socketio = require('socket.io-client');
var User = require('./user');
var createBoard = require('./board');

module.exports = function (options) {
    var name = options.name || 'HORSE';
    var user = new User(name);
    
    var socket = socketio(options.address);
    var board = createBoard(socket, user);
    
    socket.on('connect', function () {
        console.log(name + ' is well connected');
    });
    socket.on('listening', function (data) {
        if (data.id !== user.id) {
            console.log ('Received voice data from ' + data.id);
            board.output(data);
        } else {
            console.log ('Don\'t listen to yourself');
        }
    });
};