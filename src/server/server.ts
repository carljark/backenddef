import express from 'express';
import http from 'http';

import socketio from 'socket.io';

import Mail from '../email/mail';

import indexRoute from '../routes/index';

import path from 'path';
import getSampleData from '../coinmarketdata/getsampledata.function';
import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

import {Istatus} from '../coinmarketdata/datacoin.interface';
import { IResp } from '../modelos/responsesimple.interface';

import CoinsInterf from '../modelos/coins-responses';

import config from '../environment';

const dataCoinsResponse = getSampleData();

const sendMail = (data: IResp) => {
    const messageData = {
        message: JSON.stringify(data),
        subject: 'coin update',
        // to: 'elcal.lico@gmail.com',
        to: config.emailto,
    };
    const message = Object.assign({}, messageData);
    Mail.to = message.to;
    Mail.subject = message.subject;
    Mail.message = message.message;
    const result = Mail.sendMail();
};

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
            console.log('sending e-mail');
            // compruebo que se envia el e-mail
            // hay que implementar que los datos sean los últimos
            // así que tendré que definir la variable newResponse
            // fuera del intervalo
            let newResponse: IResp;
            sendMail(dataCoinsResponse);
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
                newResponse = {
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

            const emailInterval = setInterval(() => {
              sendMail(newResponse);
            }, 3600000);

            socket.on('disconnect', () => {
                console.log('user disconnected');
                clearInterval(intervalo);
                clearInterval(emailInterval);
                socket.disconnect();
            });
        });
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.httpserver.listen(this.port, callback);
    }
}
