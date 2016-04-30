var express = require('express');

module.exports = function (type, options) {
    options = options || {};
    var model = null;
    if (type === 'client') {
        model = require('./client');
    } else if (type === 'server') {
        model = require('./server');
    }
    if (!model) {
        throw new Error('An invalid model type was passed. You must pass either \'client\' or \'server\' as a parameter.');
    }
    
    var app = express();
        
    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    
    app.io = model(options);
    
    return app;
};
