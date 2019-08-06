"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var sampleDataFile = fs_1.default.readFileSync(path_1.default.join(__dirname, './samplecurrencylisting.json'));
var sampleDataObject = JSON.parse(sampleDataFile.toString());
console.log('sampleDataObject: ', sampleDataObject);
