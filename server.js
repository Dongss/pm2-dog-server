var http = require("http");
var pm2 = require("pm2");
var url = require("url");

var server = http.createServer(route);
var io = require("socket.io")(server);
var requestHandler = require("./request_handler");
requestHandler.ioInit(io);
GLOBAL.logger = GLOBAL.logger || console;

// Routes
var handle = { get: {}, post: {} };
handle.get["/test"] = requestHandler.test;
handle.get["/stop"] = requestHandler.stop;
handle.get["/restart"] = requestHandler.restart;
handle.get["/start"] = requestHandler.start;
handle.get["/reload"] = requestHandler.reload;

function route(req, res) {
    var pathname = url.parse(req.url).pathname;
    var method = req.method.toLowerCase();

    if (typeof handle[method][pathname] == 'function') {
        handle[method][pathname](req, res);
    } else {
        GLOBAL.logger.warn("No request handler found for ", pathname);
    }
}

// PM2 server
function pm2Server(callback) {
    pm2.connect(function(err) {
        if (err) { return callback(err); }
        GLOBAL.logger.info("PM2 connect success");
        return callback(null);
    });
}

// App server
module.exports = function(port, host, inverval) {
    GLOBAL.interval = inverval || 10000;
    pm2Server(function(err) {
        if (err) { 
            GLOBAL.logger.error("PM2 connect err: ", err);
            return; 
        }
        server.listen(port || 9090, host || '0.0.0.0', function() {
            GLOBAL.logger.info("PM2 server listening on port: ", port || 9090);
        });
    });
};
