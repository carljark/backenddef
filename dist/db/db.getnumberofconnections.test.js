"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_factory_1 = __importDefault(require("./db.factory"));
db_factory_1.default
    .subscribe(function (db) {
    db.admin().serverStatus()
        .then(function (info) {
        console.log(info.connections);
    });
});
