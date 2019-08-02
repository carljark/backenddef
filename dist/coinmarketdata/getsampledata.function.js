"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var sampleDataFile = fs_1.default.readFileSync('./samplecurrencylisting.json');
var sampleDataObject = JSON.parse(sampleDataFile.toString());
var getSampleData = function () {
    // convierto la respuesta en una matriz
    // más simple
    var simpleArrayCoins = new Array();
    sampleDataObject.data.forEach(function (coin) {
        simpleArrayCoins.push({
            id: coin.id,
            name: coin.slug,
            price: coin.quote.USD.price,
        });
    });
    return {
        data: simpleArrayCoins,
        status: sampleDataObject.status,
    };
};
exports.default = getSampleData;
