"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = __importDefault(require("cors"));
var coins_route_1 = __importDefault(require("./coins-route"));
var path_1 = __importDefault(require("path"));
var MainRoute = /** @class */ (function () {
    function MainRoute() {
        this.router = express_1.Router();
        this.router.use(express_1.json());
        this.router.use(express_1.urlencoded({ extended: false }));
        this.router.use(cors_1.default());
        this.routes();
    }
    MainRoute.prototype.routes = function () {
        this.router.use('/', express_1.static(path_1.default.join(__dirname, '../../public')));
        this.router.use('/api', coins_route_1.default);
    };
    return MainRoute;
}());
var indexRoute = new MainRoute().router;
exports.default = indexRoute;
