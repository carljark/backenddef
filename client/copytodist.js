"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var copyToDist = function (file) {
    fs.copyFile(path.join(__dirname, './', file), path.join(__dirname, './dist', file), function (err) {
        if (err) {
            console.log('err: ', err);
        }
        console.log("copia realizada de " + file);
    });
};
copyToDist('index.html');
// copyToDist('styles.css');
