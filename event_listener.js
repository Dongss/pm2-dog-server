var axon  = require('pm2-axon');                                      
var sub = axon.socket('sub-emitter');
var exec = require('child_process').exec;

var listener = function(io) {
    exec('ls ~/.pm2/pub.sock', function(error, stdout, stderr) {
        if (error || stderr) {
            GLOBAL.logger.error('"ls ~/.pm2/pub.sock failed" ', error, stderr);
        } else {
            var sock = stdout;
            // default ~/.pm2/pub.sock
            sub.connect(sock);
            // Events : restart, online, exit, restart overlimit, ***
            sub.on('process:*', function(e, p) {
                io.emit('event', JSON.stringify({
                    event: p
                }));
            });
        }
    });
};

module.exports = listener;
