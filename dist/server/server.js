"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var mail_1 = __importDefault(require("../email/mail"));
var index_1 = __importDefault(require("../routes/index"));
var getdata_function_1 = __importDefault(require("../coinmarketdata/getdata.function"));
var coins_responses_1 = __importDefault(require("../modelos/coins-responses"));
var environment_1 = __importDefault(require("../environment"));
var getandsavedataloop_1 = __importDefault(require("../coinmarketdata/getandsavedataloop"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var dataCoinsResponse$ = getdata_function_1.default();
var sendMail = function (data) {
    var messageData = {
        message: JSON.stringify(data),
        subject: 'coin update',
        // to: 'elcal.lico@gmail.com',
        to: environment_1.default.emailto,
    };
    var message = Object.assign({}, messageData);
    mail_1.default.to = message.to;
    mail_1.default.subject = message.subject;
    mail_1.default.message = message.message;
    var result = mail_1.default.sendMail();
};
var Server = /** @class */ (function () {
    function Server(port) {
        this.port = port;
        this.app = express_1.default();
        // inicio el socket
        this.httpserver = http_1.default.createServer(this.app);
        this.ioserver = socket_io_1.default(this.httpserver);
        // sustituto las funciones de dentro de on connection
        // por emitToAll
        this.emitToAll();
        // debo encontrar la manera de emitir a todos
        // los users a la vez
        // quizás emitiendo desde fuera del on connection
        this.ioserver.on('connection', function (socket) {
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
            socket.on('disconnect', function () {
                console.log('user disconnected');
                /* getAndEmitInterval.unsubscribe();
                clearInterval(emailInterval); */
                socket.disconnect();
            });
        });
        this.app.use('/', index_1.default);
    }
    Server.init = function (port) {
        return new Server(port);
    };
    Server.prototype.start = function (callback) {
        this.httpserver.listen(this.port, callback);
        getandsavedataloop_1.default();
    };
    Server.prototype.emitToAll = function () {
        var _this = this;
        var lastRespDb;
        dataCoinsResponse$
            .subscribe(function (dataCoinsResponse) {
            sendMail(dataCoinsResponse);
        });
        var intervalRx = rxjs_1.interval(6000);
        var getAndEmitInterval = intervalRx
            .pipe(operators_1.switchMap(function (iteration) { return coins_responses_1.default.getLast(); }))
            .subscribe(function (lastResponseDb) {
            lastRespDb = lastResponseDb;
            _this.ioserver.emit('coin update', lastResponseDb.data);
            console.log('lastResponseDb.data: ', lastResponseDb.data);
        });
        var emailInterval = setInterval(function () {
            sendMail(lastRespDb);
        }, 3600000);
    };
    return Server;
}());
exports.default = Server;
