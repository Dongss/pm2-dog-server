var pm2 = require("pm2");
var url = require("url");

module.exports.test = function(req, res) {
    res.end("Hello where . This is test");
};

module.exports.stop = function(req, res) {
    var query = url.parse(req.url,true).query;
    var pmId = query.pm_id;
    pm2.stop(pmId, function(err, proc) {
        if (err) {
            GLOBAL.logger.error("Stop process error: ", err);
            res.end(JSON.stringify({
                retCode: -1,
                Message: "Stop process failed: " + err 
            }));
            return;
        }

        res.end(JSON.stringify({
            retCode: 0
        }));
    });
};

module.exports.restart = function(req, res) {
    var query = url.parse(req.url,true).query;
    var pmId = query.pm_id;
    pm2.restart(pmId, function(err, proc) {
        if (err) {
            GLOBAL.logger.error("Restart process error: ", err);
            res.end(JSON.stringify({
                retCode: -1,
                Message: "Restart process failed: " + err
            }));
            return;
        }

        res.end(JSON.stringify({
            retCode: 0
        }));
    });
};

module.exports.start = function(req, res) {
    var query = url.parse(req.url,true).query;
    var pmId = query.pm_id;
    pm2.start(pmId, function(err, proc) {
        if (err) {
            GLOBAL.logger.error("Start process error: ", err);
            res.end(JSON.stringify({
                retCode: -1,
                Message: "Start process failed: " + err
            }));
            return;
        }

        res.end(JSON.stringify({
            retCode: 0
        }));
    });
};

module.exports.reload = function(req, res) {
    var query = url.parse(req.url,true).query;
    var pmId = query.pm_id;
    pm2.reload (pmId, function(err, proc) {
        if (err) {
            GLOBAL.logger.error("Reload process error: ", err);
            res.end(JSON.stringify({
                retCode: -1,
                Message: "Reload process failed: " + err
            }));
            return;
        }

        res.end(JSON.stringify({
            retCode: 0
        }));
    });
};

module.exports.ioInit = function(io) {
    var onGetList = function() {
        pm2.list(function(err, list) {
            if (err) {
                GLOBAL.logger.error("GET PM2 list err: ", err);
            }

            io.emit('pm2_list', {
                retCode: 0,
                list: JSON.stringify(list)
            });
        });
    };

    io.on('connection', function(socket) {
        GLOBAL.logger.info("io on conneted");
        setInterval(onGetList, GLOBAL.interval || 10000);
        socket.on('get_list', onGetList);
    });
};
