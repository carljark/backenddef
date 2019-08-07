"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var mongodb_1 = require("mongodb");
var rxjs_1 = require("rxjs");
var environment_1 = __importDefault(require("../environment"));
var Bd = /** @class */ (function () {
    function Bd() {
        var _this = this;
        this.host = environment_1.default.databaseConfig.host;
        this.port = 27017;
        this.url = "mongodb://" + environment_1.default.databaseConfig.host + ":27017/" + environment_1.default.databaseConfig.database;
        // implementar environment para que mongo y localhost
        // se establezcan en development y production
        // public url = 'mongodb://mongo:27017/backenddef';
        this.dbname = environment_1.default.databaseConfig.database;
        this.mongoFindLasts = function (cursor, ob, limit) { return __awaiter(_this, void 0, void 0, function () {
            var i, doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, cursor.hasNext()];
                    case 2:
                        if (!((_a.sent()) && i < limit)) return [3 /*break*/, 4];
                        i++;
                        return [4 /*yield*/, cursor.next()];
                    case 3:
                        doc = _a.sent();
                        ob.next(doc);
                        return [3 /*break*/, 1];
                    case 4:
                        ob.complete();
                        return [2 /*return*/];
                }
            });
        }); };
    }
    Bd.prototype.connect = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            mongodb_1.MongoClient.connect(_this.url, { useNewUrlParser: true }, function (err, client) {
                assert.equal(null, err);
                observer.next(client);
            });
        });
    };
    Bd.prototype.getHistory = function (collectionName, limit) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (client) {
                var cursor = client.db(_this.dbname)
                    .collection(collectionName)
                    .find({}).sort({ _id: -1 });
                _this.mongoFindLasts(cursor, ob, limit);
                // ob.complete();
                client.close();
            });
        });
    };
    Bd.prototype.getAll = function (collectionName) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (cliente) {
                cliente.db(_this.dbname).collection(collectionName)
                    .find({}).toArray(function (err, docs) {
                    assert.equal(err, null);
                    ob.next(docs);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.getMany = function (coleccion, atributos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (cliente) {
                cliente.db(_this.dbname).collection(coleccion)
                    .find(atributos).toArray(function (error, docs) {
                    ob.next(docs);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.getOne = function (coleccion, atributos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (cliente) {
                cliente.db(_this.dbname).collection(coleccion)
                    .findOne(atributos, function (err, result) {
                    assert.equal(err, null);
                    ob.next(result);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.getByMongoId = function (collection, idMongo) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (client) {
                client.db(_this.dbname)
                    .collection(collection)
                    .findOne({ _id: idMongo }, function (error, result) {
                    assert.equal(error, null);
                    ob.next(result);
                    client.close();
                });
            });
        });
    };
    Bd.prototype.getAllCollections = function () {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (cliente) {
                cliente.db(_this.dbname).listCollections({}, { nameOnly: true }).toArray(function (err, colecciones) {
                    assert.equal(err, null);
                    ob.next(colecciones);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.insertOne = function (coleccion, doc) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect().subscribe(function (cliente) {
                cliente.db(_this.dbname).collection(coleccion)
                    .insertOne(doc, function (err, result) {
                    assert.equal(err, null);
                    ob.next(result);
                    // cliente.close();
                });
            });
        });
    };
    Bd.prototype.insertMany = function (nombreColeccion, documentos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect().subscribe(function (cliente) {
                cliente.db(_this.dbname).collection(nombreColeccion)
                    .insertMany(documentos, function (err, result) {
                    assert.equal(err, null);
                    assert.equal(3, result.result.n);
                    assert.equal(3, result.ops.length);
                    ob.next(result);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.delMany = function (coleccion, atributos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (cliente) {
                cliente.db(_this.dbname)
                    .collection(coleccion).deleteMany(atributos, function (err, result) {
                    ob.next(result);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.delByMongoId = function (collection, idMongo) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (client) {
                client.db(_this.dbname)
                    .collection(collection)
                    .deleteOne({ _id: idMongo }, function (error, result) {
                    ob.next(result);
                    client.close();
                });
            });
        });
    };
    Bd.prototype.delAll = function (col) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect().subscribe(function (cliente) {
                cliente.db(_this.dbname).collection(col)
                    .deleteMany({}, function (err, result) {
                    ob.next(result);
                    cliente.close();
                });
            });
        });
    };
    Bd.prototype.delCollection = function (col) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (client) {
                client.db(_this.dbname).collection(col)
                    .drop(function () {
                    ob.next(true);
                    client.close();
                });
            });
        });
    };
    Bd.prototype.createIndex = function (col) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.connect()
                .subscribe(function (client) {
                client.db(_this.dbname).collection(col)
                    .createIndex({ id: 1 }, function (error, result) {
                    console.log(result);
                    ob.next(result);
                    client.close();
                });
            });
        });
    };
    Bd.prototype.printtojson = function (data) {
        console.log(JSON.stringify(data));
    };
    return Bd;
}());
var db = new Bd();
exports.default = db;
