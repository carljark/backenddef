"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var index_1 = __importDefault(require("../routes/index"));
var Server = /** @class */ (function () {
    function Server(port) {
        this.port = port;
        this.app = express_1.default();
        // inicio el socket
        this.httpserver = http_1.default.createServer(this.app);
        this.ioserver = socket_io_1.default(this.httpserver);
        this.ioserver.on('connection', function (socket) {
            console.log('a user connected');
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
