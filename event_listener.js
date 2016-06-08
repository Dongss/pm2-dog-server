var pmEvents = require('pm2-events');

var myPm = new pmEvents();

var listener = function(io) {
    myPm
    .on(function(e, p) {
        io.emit('event', JSON.stringify({
            event: p
        }));
    })
    .error(function(err) {
        GLOBAL.logger.error('pm2-events error:', err);
    });
};

module.exports = listener;
