var config = require('./config/config.json'),
    server = require('./lib/server');

// For Herkou
config.PORT = process.env.PORT || config.PORT;

server.run(config);
