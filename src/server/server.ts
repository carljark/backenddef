import express from 'express';
import http from 'http';

import indexRoute from '../routes/index';

export default class Server {
    public static init(port: number): Server {
        return new Server(port);
    }
    public app: express.Application;

    constructor(private port: number) {
        this.app = express();
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.app.listen(this.port, callback);
    }
}
