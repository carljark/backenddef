"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var coinmarketcap_sample_1 = __importDefault(require("./coinmarketcap-sample"));
/* const sampleData = fs.readFileSync('./samplecurrencylisting.json');

const dataObject = JSON.parse(sampleData.toString());

const jsonData = JSON.stringify(dataObject);

fs.writeFileSync('./prueba.json', jsonData, 'utf8'); */
// callSample();
// getCoinValue();
var CoinsRoute = /** @class */ (function () {
    function CoinsRoute() {
        var _this = this;
        //   public pricesArray: IDataCoin[] = [];
        this.pricesArray = [];
        this.router = express_1.Router();
        this.router.use(express_1.json());
        this.router.use(express_1.urlencoded({ extended: false }));
        this.routes();
        // actualizamos los precios cada 60 segundos
        coinmarketcap_sample_1.default()
            .then(function (response) {
            console.log('bitcoin: ', response.data[0]);
            _this.pricesArray = response.data;
            var jsD = JSON.stringify(response);
            // fs.writeFileSync('./samplecurrencylisting02.json', jsD, 'utf8');
        })
            .catch(function (err) {
            console.log('API call error:', err.message);
        });
        // this.getPrices();
    }
    CoinsRoute.prototype.mainRoute = function (req, res, next) {
        var dataResultArray = this.pricesArray.filter(function (elto) {
            return elto.slug === 'bitcoin' || elto.slug === 'ethereum';
        });
        var dataSimpleArray = new Array();
        dataResultArray.forEach(function (coin) {
            dataSimpleArray.push({
                id: coin.id,
                price: coin.quote.USD.price,
                name: coin.slug,
            });
        });
        console.log(dataSimpleArray);
        res.send(dataSimpleArray);
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
    CoinsRoute.prototype.routes = function () {
        this.router.get('/coins/bitcoin', this.bitCoinRoute.bind(this));
        this.router.get('/coins/ethereum', this.ethereumCoinRoute.bind(this));
        this.router.use('/coins', this.mainRoute.bind(this));
    };
    CoinsRoute.prototype.getPrices = function () {
        var _this = this;
        setInterval(function () {
            console.log('actualizando precios');
            coinmarketcap_sample_1.default()
                .then(function (response) {
                console.log('bitcoin: ', response.data);
                _this.pricesArray = response.data;
                // fs.writeFileSync('./samplecurrencylisting.json', JSON.stringify(response));
            })
                .catch(function (err) {
                console.log('API call error:', err.message);
            });
        }, 120000);
    };
    return CoinsRoute;
}());
var route = new CoinsRoute().router;
exports.default = route;
