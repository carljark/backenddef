import {connect as ioconnect } from 'socket.io-client';

import ISimpleCoin from './simplecoin.interface';

import config from './environment';

import ICoinHistory from './coin-history.interface';

import '../styles.scss';

import {AppComponent} from './app.component';

import {GetCurrenciesService} from './get-currencies.service';
import {SocketioService} from './socketio.service';

const getCurrServ = new GetCurrenciesService();

// comprobar si debo inicializar apropiadamente las matrices
const socketioService = new SocketioService();

const app = new AppComponent(getCurrServ, socketioService);
