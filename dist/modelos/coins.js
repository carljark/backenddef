"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var db_1 = __importDefault(require("../db/db"));
var InterfazCoins = /** @class */ (function () {
    function InterfazCoins() {
        this.nombreColeccion = 'responses';
        console.log('constructor de InterfazCoins');
    }
    InterfazCoins.init = function () {
        return new InterfazCoins();
    };
    InterfazCoins.prototype.getById = function (Id) {
        var coinId = {
            Id: Id,
        };
        console.log('coinId', coinId);
        return this.getOneCoin(coinId);
    };
    InterfazCoins.prototype.borrarTodos = function () {
        return db_1.default.borrarTodos(this.nombreColeccion);
    };
    InterfazCoins.prototype.borrarMuchos = function (atributos) {
        return db_1.default.Borrar(this.nombreColeccion, atributos);
    };
    InterfazCoins.prototype.buscarPorAtributos = function (atributos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            db_1.default.buscarPorAtributos(_this.nombreColeccion, atributos)
                .subscribe(function (result) {
                ob.next(result);
            });
        });
    };
    InterfazCoins.prototype.conseguirTodos = function () {
        return this.buscarPorAtributos({});
    };
    InterfazCoins.prototype.getOneCoin = function (atributos) {
        var _this = this;
        console.log('atributos en getOneCoin: ', atributos);
        return new rxjs_1.Observable(function (observer) {
            db_1.default.getOneDocByFilter(_this.nombreColeccion, atributos)
                .subscribe(function (result) {
                console.log('result: ', result);
                observer.next(result);
            });
        });
    };
    InterfazCoins.prototype.insertOneResponse = function (coinsResponse) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            // sustituir [] por un Array<Object> u otro más apropiado
            db_1.default.insertOneDoc(_this.nombreColeccion, coinsResponse, function (result) {
                // console.log('en la clase: ', true);
                observer.next(result);
            });
        });
    };
    InterfazCoins.prototype.insertarMuchos = function (nombre, pass) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            // sustituir [] por un Array<Object> u otro más apropiado
            db_1.default.insertDocuments(_this.nombreColeccion, [], function (result) {
                // console.log('result en la clase: ', result);
                observer.next(true);
            });
        });
    };
    return InterfazCoins;
}());
var modelo = InterfazCoins.init();
exports.default = modelo;
