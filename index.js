const app = require('./app');
const config = require('./config');
const http = require('http');
const server = http.createServer(app);

server.listen(config.port, () => {
    console.log('SERVER is Running');
    console.log(`Listening to port ${config.port}`);
});
