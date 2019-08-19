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

import getAndSaveDataLoop from '../coinmarketdata/getandsavedataloop';

import {interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';

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
            let lastRespDb: IResp;
            sendMail(dataCoinsResponse);
            const intervalRx = interval(6000);
            const getAndEmitInterval = intervalRx
            .pipe(
              switchMap((iteration) => CoinsInterf.getLast()),
            )
            .subscribe(lastResponseDb => {
              lastRespDb = lastResponseDb;
              socket.emit('coin update', lastResponseDb.data);
              console.log('lastResponseDb.data: ', lastResponseDb.data);
            })

            const emailInterval = setInterval(() => {
              sendMail(lastRespDb);
            }, 3600000);

            socket.on('disconnect', () => {
                console.log('user disconnected');
                getAndEmitInterval.unsubscribe();
                clearInterval(emailInterval);
                socket.disconnect();
            });
        });
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.httpserver.listen(this.port, callback);
        getAndSaveDataLoop();
    }
}
