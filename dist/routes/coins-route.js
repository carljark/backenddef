"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CoinsRoute = /** @class */ (function () {
    function CoinsRoute() {
        this.router = express_1.Router();
        this.router.use(express_1.json());
        this.router.use(express_1.urlencoded({ extended: false }));
        this.routes();
    }
    CoinsRoute.prototype.mainRoute = function (req, res, next) {
        res.json('coins value');
    };
    CoinsRoute.prototype.routes = function () {
        this.router.use('/coins', this.mainRoute.bind(this));
    };
    return CoinsRoute;
}());
var route = new CoinsRoute().router;
exports.default = route;
