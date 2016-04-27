var printHelp = function () {
    console.log ('the beatles second movie was help you moron');
};

var createServer = function (type) {
    
};

var arguments = process.argv.splice(2);

arguments.forEach((arg, index, args) => {
    if (arg === '--help' ||
        arg === '-h') {
        //help
    } else if (arg === '--client' ||
               arg === '-c') {
        //client
    } else if (arg === '--server' ||
               arg === '-s') {
        //server
    } else {
        //help
    }
});