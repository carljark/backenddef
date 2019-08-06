import express from 'express';
import http from 'http';

import socketio from 'socket.io';

import indexRoute from '../routes/index';

import path from 'path';
import getSampleData from '../coinmarketdata/getsampledata.function';
import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

import {Istatus} from '../coinmarketdata/datacoin.interface';
import { IResp } from '../modelos/responsesimple.interface';

import CoinsInterf from '../modelos/coins-responses';

const dataCoinsResponse = getSampleData();

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
            const intervalo = setInterval(() => {
                const newDataCoins = new Array<ISimpleCoin>();
                const newStatus: Istatus = dataCoinsResponse.status;
                newStatus.timestamp = new Date();
                // modifico aleatoriamente los datos de ejemplo
                // en modo development
                // pero los sustituyo en produccion
                // por la datos de coinmarket
                dataCoinsResponse.data.forEach((coin) => {
                    const newPrice = Math.round((coin.price * Math.random()) * 100) / 100;
                    newDataCoins.push({
                        id: coin.id,
                        name: coin.name,
                        price: newPrice,
                    });
                });
                const newResponse: IResp = {
                    data: newDataCoins,
                    status: newStatus,
                };
                // emito solo el array de coins
                // pero genero el nuevo estatus para guardarlo
                // en la base de datos y poder
                // recuperar todas las respuestas buscando por el timestamp

                // en este punto guardo en la base de datos
                CoinsInterf.insertOne(newResponse)
                .subscribe((result) => {
                    console.log('result de insertar una response: ', result.result);
                });
                socket.emit('coin update', newDataCoins);
            }, 6000);
            socket.on('disconnect', () => {
                console.log('user disconnected');
                clearInterval(intervalo);
                socket.disconnect();
            });
        });
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.httpserver.listen(this.port, callback);
    }
}
