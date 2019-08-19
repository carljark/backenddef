"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var getsampledata_function_1 = __importDefault(require("../coinmarketdata/getsampledata.function"));
var coins_responses_1 = __importDefault(require("../modelos/coins-responses"));
var getAndSaveDataLoop = function () {
    var dataCoinsResponse;
    var getDataAndSaveInterval = rxjs_1.interval(6000);
    getDataAndSaveInterval
        .pipe(operators_1.switchMap(function (time) {
        dataCoinsResponse = getsampledata_function_1.default();
        console.log('nuevos resultados: ', dataCoinsResponse);
        return coins_responses_1.default.insertOne(dataCoinsResponse);
    }))
        .subscribe(function (result) {
        console.log('result de insertar la nueva response: ', result.insertedId);
    });
};
exports.default = getAndSaveDataLoop;
