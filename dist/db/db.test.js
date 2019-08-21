"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var getdata_function_1 = __importDefault(require("../coinmarketdata/getdata.function"));
var db_1 = __importDefault(require("./db"));
var db_factory_1 = __importDefault(require("./db.factory"));
var dataSample = getdata_function_1.default();
db_factory_1.default
    .pipe(operators_1.mergeMap(function (db) { return dataSample; }, function (db, doc) { return ({ db: db, doc: doc }); }), operators_1.switchMap(function (dbAndDoc) { return db_1.default.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc); }, function (cliDataInsert) { return cliDataInsert.db; }), operators_1.switchMap(function (db) {
    return db_1.default.getLast(db, 'responses');
}, function (db, lastres) { return ({ db: db, lastres: lastres }); }), operators_1.mergeMap(function (dbAndRes) {
    console.log(dbAndRes.lastres);
    return db_1.default.delAll(dbAndRes.db, 'responses');
}, function (dbAndRes, resDel) { return ({ db: dbAndRes.db, resDel: resDel }); }))
    .subscribe(function (dbAndDel) {
    console.log(dbAndDel.resDel.result);
});
