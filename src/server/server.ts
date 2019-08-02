import express from 'express';
import http from 'http';

import socketio from 'socket.io';

import indexRoute from '../routes/index';

import path from 'path';

export default class Server {
    public static init(port: number): Server {
        return new Server(port);
    }

    public ioserver: socketio.Server;

    public app: express.Application;

    public httpserver: http.Server;

    constructor(private port: number) {
        this.app = express();
        // inicio el socket
        this.httpserver = http.createServer(this.app);
        this.ioserver = socketio(this.httpserver);
        this.ioserver.on('connection', (socket) => {
            console.log('a user connected');
        });
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.httpserver.listen(this.port, callback);
    }
}
