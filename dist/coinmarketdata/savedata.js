"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getsampledata_function_1 = __importDefault(require("../coinmarketdata/getsampledata.function"));
var coins_responses_1 = __importDefault(require("../modelos/coins-responses"));
var getAndSaveDataLoop = function () {
    var dataCoinsResponse;
    var intervalo = setInterval(function () {
        dataCoinsResponse = getsampledata_function_1.default();
        coins_responses_1.default.insertOne(dataCoinsResponse)
            .subscribe(function (result) {
            console.log('result de insertar una response: ', result.result);
        });
    }, 6000);
};
exports.default = getAndSaveDataLoop;
