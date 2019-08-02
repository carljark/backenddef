"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = __importDefault(require("fs"));
var sampleDataFile = fs_1.default.readFileSync('./samplecurrencylisting.json');
var sampleDataObject = JSON.parse(sampleDataFile.toString());
var sampleDataJson = JSON.stringify(sampleDataObject);
// fs.writeFileSync('./prueba.json', jsonData, 'utf8');
// callSample();
// getCoinValue();
var CoinsRoute = /** @class */ (function () {
    function CoinsRoute() {
        //   public pricesArray: IDataCoin[] = [];
        this.pricesArray = [];
        this.router = express_1.Router();
        this.router.use(express_1.json());
        this.router.use(express_1.urlencoded({ extended: false }));
        this.routes();
        // actualizamos los precios cada 60 segundos
        // sustituimos la llamada por los resultados guardados
        // para pruebas
        this.pricesArray = sampleDataObject.data;
        console.log(this.pricesArray);
        /* callSample()
          .then((response: IresponseDataCoin) => {
            console.log('bitcoin: ', response.data[0]);
            this.pricesArray = response.data;
            const jsD = JSON.stringify(response);
            // fs.writeFileSync('./samplecurrencylisting02.json', jsD, 'utf8');
          })
          .catch((err) => {
            console.log('API call error:', err.message);
          }); */
        this.updatePrices();
    }
    CoinsRoute.prototype.mainRoute = function (req, res, next) {
        // al acceder a esta ruta establecemos una conexion permanente
        // con el cliente a traves de websockets con socket.io
        var dataResultArray = this.pricesArray.filter(function (elto) {
            return elto.slug === 'bitcoin' || elto.slug === 'ethereum';
        });
        var dataSimpleArray = new Array();
        dataResultArray.forEach(function (coin) {
            dataSimpleArray.push({
                id: coin.id,
                name: coin.slug,
                price: coin.quote.USD.price,
            });
        });
        console.log(dataSimpleArray);
        res.send(dataSimpleArray);
        next();
    };
    CoinsRoute.prototype.bitCoinRoute = function (req, res, next) {
        var bitcoin = this.pricesArray.find(function (elto) {
            return elto.slug === 'bitcoin';
        });
        console.log(bitcoin);
        if (bitcoin) {
            var simplebitcoin = {
                id: bitcoin.id,
                name: bitcoin.slug,
                price: bitcoin.quote.USD.price,
            };
            res.json(simplebitcoin.price);
        }
        else {
            res.send('no se ha encontrado bitcoin');
        }
    };
    CoinsRoute.prototype.ethereumCoinRoute = function (req, res, next) {
        var bitcoin = this.pricesArray.find(function (elto) {
            return elto.slug === 'ethereum';
        });
        console.log(bitcoin);
        if (bitcoin) {
            var simplebitcoin = {
                id: bitcoin.id,
                name: bitcoin.slug,
                price: bitcoin.quote.USD.price,
            };
            res.json(simplebitcoin.price);
        }
        else {
            res.send('no se ha encontrado ethereum');
        }
    };
    CoinsRoute.prototype.routes = function () {
        this.router.get('/coins/bitcoin', this.bitCoinRoute.bind(this));
        this.router.get('/coins/ethereum', this.ethereumCoinRoute.bind(this));
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
