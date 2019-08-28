"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var copyToDist = function (dirOrig, dirDest, file) {
    fs.copyFile(path.join(__dirname, dirOrig, file), path.join(__dirname, dirDest, file), function (err) {
        if (err) {
            console.log('err: ', err);
        }
        console.log("copia realizada de " + file);
    });
};
copyToDist('./src/coinmarketdata', './dist/coinmarketdata', 'samplecurrencylisting20190819_114550.json');
// copyToDist('styles.css');