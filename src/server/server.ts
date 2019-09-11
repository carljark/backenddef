import express from 'express';
import http from 'http';

import socketio from 'socket.io';

import Mail from '../email/mail';

import indexRoute from '../routes/index';

import getData$ from '../coinmarketdata/getdata.function';
import { IResp } from '../interfaces/response-simplified.interface';

import CoinsInterf from '../dbmodels/coins-responses';

import config from '../environment';

import getAndSaveDataLoop from '../coinmarketdata/getandsavedataloop';

import {interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import https from 'https';

import {credentials} from './credentials';

const mode = process.env.NODE_ENV;

const dataCoinsResponse$ = getData$();

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

    public server: http.Server | https.Server;

    constructor(private port: number) {
        this.app = express();
        if (mode === 'development') {
            // this.server = http.createServer(this.app);
            this.server = https.createServer(credentials , this.app);
        } else {
            this.server = https.createServer(credentials , this.app);
        }
        this.ioserver = socketio(this.server);
        // inicio el socket

        // sustituto las funciones de dentro de on connection
        // por emitToAll
        this.emitToAll();
        // debo encontrar la manera de emitir a todos
        // los users a la vez
        // quizás emitiendo desde fuera del on connection
        this.ioserver.on('connection', (socket) => {
            console.log('a user connected');
            console.log('sending e-mail');
            // compruebo que se envia el e-mail
            // hay que implementar que los datos sean los últimos
            // así que tendré que definir la variable newResponse
            // fuera del intervalo
            /* let lastRespDb: IResp;
            sendMail(dataCoinsResponse);
            const intervalRx = interval(6000);
            const getAndEmitInterval = intervalRx
            .pipe(
              switchMap((iteration) => CoinsInterf.getLast()),
            )
            .subscribe((lastResponseDb) => {
              lastRespDb = lastResponseDb;
              socket.emit('coin update', lastResponseDb.data);
              console.log('lastResponseDb.data: ', lastResponseDb.data);
            });

            const emailInterval = setInterval(() => {
              sendMail(lastRespDb);
            }, 3600000); */

            socket.on('disconnect', () => {
                console.log('user disconnected');
                /* getAndEmitInterval.unsubscribe();
                clearInterval(emailInterval); */
                socket.disconnect();
            });
        });
        this.app.use('/', indexRoute);
    }

    public start(callback?: () => void) {
        this.server.listen(this.port, callback);
        getAndSaveDataLoop();

    }

    public emitToAll() {
        let lastRespDb: IResp;
        dataCoinsResponse$
        .subscribe((dataCoinsResponse) => {
            sendMail(dataCoinsResponse);
        });
        const intervalRx = interval(6000);
        const getAndEmitInterval = intervalRx
        .pipe(
            switchMap((iteration) => CoinsInterf.getLast()),
        )
        .subscribe((lastResponseDb) => {
            lastRespDb = lastResponseDb;
            this.ioserver.emit('coin update', lastResponseDb.data);
            // console.log('lastResponseDb.data: ', lastResponseDb.data);
        });

        const emailInterval = setInterval(() => {
            sendMail(lastRespDb);
        }, 3600000);
    }
}
