"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var index_1 = __importDefault(require("../routes/index"));
var getsampledata_function_1 = __importDefault(require("../coinmarketdata/getsampledata.function"));
var dataCoins = getsampledata_function_1.default();
var Server = /** @class */ (function () {
    function Server(port) {
        this.port = port;
        this.app = express_1.default();
        // inicio el socket
        this.httpserver = http_1.default.createServer(this.app);
        this.ioserver = socket_io_1.default(this.httpserver);
        this.ioserver.on('connection', function (socket) {
            console.log('a user connected');
            setInterval(function () {
                var newDataCoins = new Array();
                // modifico aleatoriamente los datos de ejemplo
                // en modo development
                // pero los sustituyo en produccion
                // por la datos de coinmarket
                dataCoins.forEach(function (coin) {
                    var newPrice = Math.round((coin.price * Math.random()) * 100) / 100;
                    newDataCoins.push({
                        id: coin.id,
                        name: coin.name,
                        price: newPrice,
                    });
                });
                socket.emit('coin update', newDataCoins);
            }, 6000);
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
