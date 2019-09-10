import '../styles.scss';

import {AppComponent} from './app.component';

import {GetCurrenciesService} from './get-currencies.service';
import {SocketioService} from './socketio.service';

const getCurrServ = new GetCurrenciesService();

const socketioService = new SocketioService();

const app = new AppComponent(getCurrServ, socketioService);
