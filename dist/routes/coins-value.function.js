"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var getCoinValue = function () {
    axios_1.default.get('https://coinmarketcap.com/es/api/')
        .then(function (respuesta) {
        console.log('respuesta desde getCoinValue');
        console.log(respuesta);
    })
        .catch(function (error) {
        console.log('error: ', error);
    });
};
exports.default = getCoinValue;
