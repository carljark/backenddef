"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var getdatacoinmarket_1 = __importDefault(require("./getdatacoinmarket"));
var environment_1 = require("../environment");
var rxjs_1 = require("rxjs");
var getData;
if (environment_1.mode === 'production') {
    getData = function () {
        return new rxjs_1.Observable(function (ob) {
            getdatacoinmarket_1.default()
                .then(function (response) {
                ob.next(response);
            })
                .catch(function (err) {
                console.log('API call error: ', err.message);
            });
        });
    };
}
else {
    var sampleDataFile = fs_1.default.readFileSync(path_1.default.join(__dirname, './samplecurrencylisting20190819_114550.json'));
    var sampleDataObject_1 = JSON.parse(sampleDataFile.toString());
    getData = function () {
        return new rxjs_1.Observable(function (ob) {
            sampleDataObject_1.status.timestamp = new Date();
            var simpleArrayCoins = new Array();
            sampleDataObject_1.data.forEach(function (coin) {
                var aleatorio = 0.8 + (1.2 - 0.8) * Math.random();
                var newPrice = Math.round(coin.quote.USD.price * aleatorio * 100) / 100;
                simpleArrayCoins.push({
                    id: coin.id,
                    name: coin.slug,
                    price: newPrice,
                });
            });
            ob.next({
                data: simpleArrayCoins,
                status: sampleDataObject_1.status,
            });
        });
    };
}
exports.default = getData;
