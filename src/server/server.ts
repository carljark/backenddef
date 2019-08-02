import express from 'express';
import http from 'http';

import socketio from 'socket.io';

import indexRoute from '../routes/index';

import path from 'path';
import getSampleData from '../coinmarketdata/getsampledata.function';
import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

const dataCoins = getSampleData();

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
            setInterval(() => {
                const newDataCoins = new Array<ISimpleCoin>();
                // modifico aleatoriamente los datos de ejemplo
                // en modo development
                // pero los sustituyo en produccion
                // por la datos de coinmarket
                dataCoins.forEach((coin) => {
                    const newPrice = Math.round((coin.price * Math.random()) * 100) / 100;
                    newDataCoins.push({
                        id: coin.id,
                        name: coin.name,
                        price: newPrice,
                    });
                });
                socket.emit('coin update', newDataCoins);
            }, 6000);
        });
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.httpserver.listen(this.port, callback);
    }
}
