"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./server/server"));
var port = 8000;
var server = server_1.default.init(port);
server.start(function () {
    console.log("servidor escuchando en el puerto " + port);
});
