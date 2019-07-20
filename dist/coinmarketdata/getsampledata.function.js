"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var sampleDataFile = fs_1.default.readFileSync(path_1.default.join(__dirname, './samplecurrencylisting.json'));
var sampleDataObject = JSON.parse(sampleDataFile.toString());
var getSampleData = function () {
    // convierto la respuesta en una matriz
    // más simple
    sampleDataObject.status.timestamp = new Date();
    var simpleArrayCoins = new Array();
    sampleDataObject.data.forEach(function (coin) {
        var newPrice = Math.round((coin.quote.USD.price * Math.random()) * 100) / 100;
        simpleArrayCoins.push({
            id: coin.id,
            name: coin.slug,
            price: newPrice,
        });
    });
    return {
        data: simpleArrayCoins,
        status: sampleDataObject.status,
    };
};
exports.default = getSampleData;
