"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = __importDefault(require("../environment"));
var url = "mongodb://" + environment_1.default.databaseConfig.host + ":27017";
var BdFact = /** @class */ (function () {
    function BdFact() {
    }
    BdFact.connect = function () {
        return rxjs_1.from(mongodb_1.MongoClient.connect(url, { bufferMaxEntries: 0, useNewUrlParser: true }))
            .pipe(operators_1.map(function (cli) { return cli.db(environment_1.default.databaseConfig.database); }));
    };
    BdFact.db = BdFact.connect();
    return BdFact;
}());
exports.BdFact = BdFact;
var db = BdFact.db;
exports.default = db;
