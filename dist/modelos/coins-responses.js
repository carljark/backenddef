"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var db_1 = __importDefault(require("../db/db"));
var db_factory_1 = __importDefault(require("../db/db.factory"));
var InterfazCoins = /** @class */ (function () {
    function InterfazCoins() {
        this.collectionName = 'responses';
    }
    InterfazCoins.init = function () {
        return new InterfazCoins();
    };
    InterfazCoins.prototype.getAll = function () {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getAll(db, _this.collectionName); }), operators_1.map(function (res) { return res; }));
    };
    InterfazCoins.prototype.getOne = function (attrib) {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getOne((db), _this.collectionName, attrib); }), operators_1.map(function (object) { return object; }));
    };
    InterfazCoins.prototype.getByMongoId = function (idMongo) {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getByMongoId((db), _this.collectionName, idMongo); }), operators_1.map(function (res) { return res; }));
    };
    InterfazCoins.prototype.getLast = function () {
        var _this = this;
        // return this.getHistoryByCount(1);
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getLast((db), _this.collectionName); }), operators_1.map(function (respOb) { return respOb; }));
    };
    /**
     * Emite una cadena de respuestas, no una matriz.
     * @param limit límite de emisiones de IRespDb
     */
    InterfazCoins.prototype.getHistoryByCount = function (limit) {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getHistory((db), _this.collectionName, limit); }), operators_1.map(function (historyobject) { return historyobject; }));
    };
    /**
     * Devuelve todas las respuestas
     * guardadas en la coleccion responses
     * en formato [{status: status, data: array},...]
     * @param dateInit Fecha inicial
     * @param dateEnd Fecha Final
     */
    InterfazCoins.prototype.getByDateRange = function (dateInit, dateEnd) {
        var _this = this;
        var filter = {
            'status.timestamp': {
                $gt: dateInit,
                $lt: dateEnd,
            },
        };
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getMany((db), _this.collectionName, filter); }), operators_1.map(function (result) { return result; }));
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
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.getMany((db), _this.collectionName, attribs); }), operators_1.map(function (result) { return result; }));
    };
    InterfazCoins.prototype.delAll = function () {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.delAll((db), _this.collectionName); }));
    };
    InterfazCoins.prototype.delMany = function (atributos) {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.delMany((db), _this.collectionName, atributos); }));
    };
    InterfazCoins.prototype.delByMongoId = function (idMongo) {
        var _this = this;
        return db_factory_1.default.pipe(operators_1.switchMap(function (db) { return db_1.default.delByMongoId((db), _this.collectionName, idMongo); }));
    };
    InterfazCoins.prototype.insertOne = function (coinsResponse) {
        var _this = this;
        return db_factory_1.default.pipe(operators_1.switchMap(function (db) { return db_1.default.insertOne((db), _this.collectionName, coinsResponse); }));
    };
    InterfazCoins.prototype.insertMany = function (respCoinsArray) {
        var _this = this;
        return db_factory_1.default
            .pipe(operators_1.switchMap(function (db) { return db_1.default.insertMany((db), _this.collectionName, respCoinsArray); }), operators_1.mapTo(true));
    };
    return InterfazCoins;
}());
var modelo = InterfazCoins.init();
exports.default = modelo;
