"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_factory_1 = __importDefault(require("./db.factory"));
db_factory_1.default.subscribe(function (d) {
    console.log('conectado: ');
    d.listCollections({}, { nameOnly: true })
        .toArray(function (err, colecciones) {
        console.log('collections: ', colecciones);
    });
});
