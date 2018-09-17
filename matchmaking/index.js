const http = require('http');
const socketio = require('socket.io');
const Matchmaking = require('./core');

const server = http.createServer((req, res) => {
    res.end('tt');
});

const io = socketio.listen(server);

const matchmaking = Matchmaking(io);

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listening on port *:${port}`));
