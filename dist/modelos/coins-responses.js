"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var db_1 = __importDefault(require("../db/db"));
var InterfazCoins = /** @class */ (function () {
    function InterfazCoins() {
        this.collectionName = 'responses';
    }
    InterfazCoins.init = function () {
        return new InterfazCoins();
    };
    InterfazCoins.prototype.getAll = function () {
        return db_1.default.getAll(this.collectionName)
            .pipe(operators_1.map(function (res) { return res; }));
    };
    InterfazCoins.prototype.getOne = function (attrib) {
        return db_1.default.getOne(this.collectionName, attrib)
            .pipe(operators_1.map(function (object) { return object; }));
    };
    InterfazCoins.prototype.getByMongoId = function (idMongo) {
        return db_1.default.getByMongoId(this.collectionName, idMongo)
            .pipe(operators_1.map(function (res) { return res; }));
    };
    InterfazCoins.prototype.getLast = function () {
        return this.getHistoryByCount(1);
    };
    /**
     * Emite una cadena de respuestas, no una matriz.
     * @param limit límite de emisiones de IRespDb
     */
    InterfazCoins.prototype.getHistoryByCount = function (limit) {
        return db_1.default.getHistory(this.collectionName, limit)
            .pipe(operators_1.map(function (historyobject) { return historyobject; }));
    };
    /**
     * Devuelve todas las respuestas
     * guardadas en la coleccion responses
     * en formato [{status: status, data: array},...]
     * @param dateInit Fecha inicial
     * @param dateEnd Fecha Final
     */
    InterfazCoins.prototype.getByDateRange = function (dateInit, dateEnd) {
        var filter = {
            'status.timestamp': {
                $gt: dateInit,
                $lt: dateEnd,
            },
        };
        return db_1.default.getMany(this.collectionName, filter)
            .pipe(operators_1.map(function (result) { return result; }));
    };
    /**
     * Devuelve un objeto con el name y un array con el timestamp y el price
     * @param endDate Fecha tope
     * @param mins Minutos a contar hacia atrás
     * @param name nombre de la moneda a localizar
     */
    InterfazCoins.prototype.getHistoryFromDateToMinsAndName = function (endDate, mins, name) {
        var MS_PER_MINUTE = 60000;
        // quitar para production
        // const nowDate = (new Date()).valueOf();
        return this.getByDateRange(new Date(endDate.valueOf() - mins * MS_PER_MINUTE), endDate)
            .pipe(operators_1.map(function (result) {
            // voy a filtrar la matriz de la
            // propiedad data para que solo
            // estén los datos de name (el nombre de la coin)
            var timePriceArray = new Array();
            // como es un callback habrá que usar await
            // en una función async, quizás
            result.forEach(function (res) {
                var dx = res.data.findIndex(function (co) {
                    return co.name === name;
                });
                timePriceArray.push({
                    price: res.data[dx].price,
                    timestamp: res.status.timestamp,
                });
            });
            var coinHistory = {
                name: name,
                timePriceArray: timePriceArray,
            };
            return coinHistory;
        }));
    };
    InterfazCoins.prototype.getMany = function (attribs) {
        return db_1.default.getMany(this.collectionName, attribs)
            .pipe(operators_1.map(function (result) { return result; }));
    };
    InterfazCoins.prototype.delAll = function () {
        return db_1.default.delAll(this.collectionName);
    };
    InterfazCoins.prototype.delMany = function (atributos) {
        return db_1.default.delMany(this.collectionName, atributos);
    };
    InterfazCoins.prototype.delByMongoId = function (idMongo) {
        return db_1.default.delByMongoId(this.collectionName, idMongo);
    };
    InterfazCoins.prototype.insertOne = function (coinsResponse) {
        return db_1.default.insertOne(this.collectionName, coinsResponse);
    };
    InterfazCoins.prototype.insertMany = function (respCoinsArray) {
        return db_1.default.insertMany(this.collectionName, respCoinsArray)
            .pipe(operators_1.mapTo(true));
    };
    return InterfazCoins;
}());
var modelo = InterfazCoins.init();
exports.default = modelo;
