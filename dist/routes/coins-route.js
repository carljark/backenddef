"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var getdata_function_1 = __importDefault(require("../coinmarketdata/getdata.function"));
var dataResponse$ = getdata_function_1.default();
var coins_responses_1 = __importDefault(require("../modelos/coins-responses"));
var CoinsRoute = /** @class */ (function () {
    function CoinsRoute() {
        this.router = express_1.Router();
        this.router.use(express_1.json());
        this.router.use(express_1.urlencoded({ extended: false }));
        this.routes();
    }
    CoinsRoute.prototype.mainRoute = function (req, res, next) {
        // al acceder a esta ruta establecemos una conexion permanente
        // con el cliente a traves de websockets con socket.io
        dataResponse$
            .subscribe(function (dataResponse) {
            console.log(dataResponse.data);
            var dataResultArray = dataResponse.data.filter(function (elto) {
                return elto.name === 'bitcoin' || elto.name === 'ethereum';
            });
            dataResponse.status.timestamp = new Date();
            res.send(dataResultArray);
            next();
        });
    };
    CoinsRoute.prototype.bitCoinRoute = function (req, res, next) {
        dataResponse$
            .subscribe(function (dataResponse) {
            var bitcoin = dataResponse.data.find(function (elto) {
                return elto.name === 'bitcoin';
            });
            console.log(bitcoin);
            if (bitcoin) {
                res.json(bitcoin.price);
            }
            else {
                res.send('no se ha encontrado bitcoin');
            }
        });
    };
    CoinsRoute.prototype.ethereumCoinRoute = function (req, res, next) {
        dataResponse$
            .subscribe(function (dataResponse) {
            var ethereum = dataResponse.data.find(function (elto) {
                return elto.name === 'ethereum';
            });
            console.log(ethereum);
            if (ethereum) {
                res.json(ethereum.price);
            }
            else {
                res.send('no se ha encontrado ethereum');
            }
        });
    };
    CoinsRoute.prototype.getHistory = function (req, res, next) {
        coins_responses_1.default.getAll()
            .subscribe(function (result) {
            console.log('result de todas las respuestas', result);
            res.send(result);
        });
    };
    CoinsRoute.prototype.getHistoryCoin = function (req, res, next) {
        console.log('req.params: ', req.params.name);
        coins_responses_1.default.getHistoryFromDateToMinsAndName(new Date(), 10, req.params.name)
            .subscribe(function (history) {
            console.log('icoinhistory: ', history);
            res.send(history);
        });
    };
    CoinsRoute.prototype.routes = function () {
        this.router.get('/coins/bitcoin', this.bitCoinRoute.bind(this));
        this.router.get('/coins/ethereum', this.ethereumCoinRoute.bind(this));
        this.router.get('/coins/history', this.getHistory.bind(this));
        this.router.get('/coins/history/:name', this.getHistoryCoin.bind(this));
        this.router.use('/coins', this.mainRoute.bind(this));
    };
    CoinsRoute.prototype.updatePrices = function () {
        setInterval(function () {
            console.log('actualizando precios');
            /* callSample()
              .then((response) => {
                console.log('bitcoin: ', response.data);
                this.pricesArray = response.data;
                // fs.writeFileSync('./samplecurrencylisting.json', JSON.stringify(response));
              })
              .catch((err) => {
                console.log('API call error:', err.message);
              }); */
        }, 60000);
    };
    return CoinsRoute;
}());
var route = new CoinsRoute().router;
exports.default = route;
