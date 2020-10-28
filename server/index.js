import app from './server.js';
import http from 'http';

const port = 3000;

app.set('port', port);
const server = http.createServer(app);
server.on('error', error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.log(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.log(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', () => console.log(`Server started: http://localhost:${port}/`))
server.listen(port);
