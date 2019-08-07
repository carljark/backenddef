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
var getsampledata_function_1 = __importDefault(require("../coinmarketdata/getsampledata.function"));
var coins_responses_1 = __importDefault(require("../modelos/coins-responses"));
var dataCoinsResponse = getsampledata_function_1.default();
var sendMail = function (data) {
    var messageData = {
        message: JSON.stringify(data),
        subject: 'coin update',
        // to: 'elcal.lico@gmail.com',
        to: 'godoy@archrog.localdomain',
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
        this.ioserver.on('connection', function (socket) {
            console.log('a user connected');
            console.log('sending e-mail');
            // compruebo que se envia el e-mail
            // hay que implementar que los datos sean los últimos
            // así que tendré que definir la variable newResponse
            // fuera del intervalo
            var newResponse;
            sendMail(dataCoinsResponse);
            var intervalo = setInterval(function () {
                var newDataCoins = new Array();
                var newStatus = dataCoinsResponse.status;
                newStatus.timestamp = new Date();
                // modifico aleatoriamente los datos de ejemplo
                // en modo development
                // pero los sustituyo en produccion
                // por la datos de coinmarket
                dataCoinsResponse.data.forEach(function (coin) {
                    var newPrice = Math.round((coin.price * Math.random()) * 100) / 100;
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
                coins_responses_1.default.insertOne(newResponse)
                    .subscribe(function (result) {
                    console.log('result de insertar una response: ', result.result);
                });
                socket.emit('coin update', newDataCoins);
            }, 6000);
            var emailInterval = setInterval(function () {
                sendMail(newResponse);
            }, 3600000);
            socket.on('disconnect', function () {
                console.log('user disconnected');
                clearInterval(intervalo);
                clearInterval(emailInterval);
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
    };
    return Server;
}());
exports.default = Server;
