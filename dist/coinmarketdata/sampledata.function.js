"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var sampleDataFile = fs_1.default.readFileSync('./samplecurrencylisting.json');
var sampleDataObject = JSON.parse(sampleDataFile.toString());
var getSampleData = function () {
    return sampleDataObject;
};
exports.default = getSampleData;
