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
    .pipe(operators_1.mergeMap(function (db) { return getdata_function_1.default(); }, function (db, dataToInsert) { return ({ db: db, dataToInsert: dataToInsert }); }), operators_1.switchMap(function (cliDataInsert) { return db_1.default.insertOne(cliDataInsert.db, 'responses', cliDataInsert.dataToInsert); }, function (dbAndDoc) { return ({ db: dbAndDoc.db, doc: dbAndDoc.dataToInsert }); }), operators_1.switchMap(function (dbAndDoc) {
    return db_1.default.getLast(dbAndDoc.db, 'responses');
}, function (dbAndDoc, lastres) { return ({ db: dbAndDoc.db, doc: dbAndDoc.doc, lastres: lastres }); }), operators_1.mergeMap(function (dbAndRes) {
    console.log('getLast: ', dbAndRes.lastres);
    return db_1.default.delAll(dbAndRes.db, 'responses');
}, function (dbAndRes, resDel) { return ({ db: dbAndRes.db, doc: dbAndRes.doc, resDel: resDel }); }), operators_1.switchMap(function (dbAndResdel) { return db_1.default.insertOne(dbAndResdel.db, 'responses', dbAndResdel.doc); }, function (dbDocDel) { return ({ db: dbDocDel.db, resDel: dbDocDel.resDel }); }))
    .subscribe(function (dbResDel) {
    console.log(dbResDel.resDel.result);
});
db_factory_1.default
    .pipe(operators_1.mergeMap(function (db) { return getdata_function_1.default(); }, function (db, doc) { return ({ db: db, doc: doc }); }), operators_1.switchMap(function (dbAndDoc) { return db_1.default.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc); }, function (dAndDoc) { return (dAndDoc.db); }), operators_1.switchMap(function (db) { return db_1.default.getLastFromPromised(db, 'responses'); }, function (db, array) { return ({ db: db, array: array }); }))
    .subscribe(function (cliAndArray) {
    console.log(cliAndArray.array[0]);
});
db_factory_1.default
    .pipe(operators_1.mergeMap(function (db) { return getdata_function_1.default(); }, function (db, doc) { return ({ db: db, doc: doc }); }), operators_1.switchMap(function (dbAndDoc) { return db_1.default.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc); }, function (dAndDoc) { return (dAndDoc.db); }), operators_1.switchMap(function (db) { return db_1.default.getLastFromPromised(db, 'responses'); }, function (db, array) { return ({ db: db, array: array }); }))
    .subscribe(function (cliAndArray) {
    console.log(cliAndArray.array[0]);
});
