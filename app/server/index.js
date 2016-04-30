const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(socket);
});

server.listen(3000);