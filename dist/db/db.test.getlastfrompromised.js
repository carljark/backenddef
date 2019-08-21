"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var getdata_function_1 = __importDefault(require("../coinmarketdata/getdata.function"));
var db_1 = __importDefault(require("./db"));
var db_factory_1 = __importDefault(require("./db.factory"));
db_factory_1.default
    .pipe(operators_1.mergeMap(function (db) { return getdata_function_1.default(); }, function (db, doc) { return ({ db: db, doc: doc }); }), operators_1.switchMap(function (dbAndDoc) { return db_1.default.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc); }, function (dAndDoc) { return (dAndDoc.db); }), operators_1.switchMap(function (db) { return db_1.default.getLastFromPromised(db, 'responses'); }, function (db, array) { return ({ db: db, array: array }); }))
    .subscribe(function (cliAndArray) {
    console.log(cliAndArray.array[0]);
});
