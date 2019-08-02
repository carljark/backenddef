"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var mongodb_1 = require("mongodb");
var rxjs_1 = require("rxjs");
var Bd = /** @class */ (function () {
    // public usercollection: Collection;
    function Bd() {
        // public mgclientoptions: MongoClientOptions;
        this.host = 'localhost';
        this.port = 27017;
        this.url = 'mongodb://localhost:27017/backenddef';
        this.dbname = 'backenddef';
        console.log('constructor de Bd');
    }
    Bd.prototype.conectar = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            mongodb_1.MongoClient.connect(_this.url, { useNewUrlParser: true }, function (err, client) {
                assert.equal(null, err);
                // console.log('Conectado satisfactoriamente al servidor');
                observer.next(client.db(_this.dbname));
                client.close();
            });
        });
    };
    Bd.prototype.borrarTodos = function (col) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar().subscribe(function (d) {
                d.collection(col)
                    .deleteMany({}, function (err, docs) {
                    ob.next(docs);
                });
            });
        });
    };
    Bd.prototype.conseguirTodosDocsDeColeccion = function (col) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar().subscribe(function (d) {
                d.collection(col)
                    .find({}).toArray(function (err, docs) {
                    assert.equal(err, null);
                    ob.next(docs);
                });
            });
        });
    };
    Bd.prototype.conseguirTodasColecciones = function () {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar().subscribe(function (d) {
                d.listCollections({}, { nameOnly: true }).toArray(function (err, colecciones) {
                    assert.equal(err, null);
                    ob.next(colecciones);
                });
            });
        });
    };
    Bd.prototype.getOneDocByFilter = function (collection, filter) {
        var _this = this;
        console.log('filtro: ', filter);
        var filtro;
        filtro = filter;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar().subscribe(function (d) {
                // FilterQuery<any>
                d.collection(collection).findOne(filter, function (err, result) {
                    console.log('result getdocbyfilter: ', result);
                    ob.next(result);
                });
            });
        });
    };
    Bd.prototype.buscarPorAtributos = function (coleccion, atributos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar().subscribe(function (d) {
                d.collection(coleccion)
                    .find(atributos).toArray(function (error, docs) {
                    ob.next(docs);
                });
            });
        });
    };
    Bd.prototype.getAllDocuments = function (callback) {
        this.conectar().subscribe(function (d) {
            d.collection('documents')
                .find({}).toArray(function (err, docs) {
                assert.equal(err, null);
                callback(docs);
            });
        });
    };
    Bd.prototype.getDocbyAtrib = function (coleccion, atributos, callback) {
        this.conectar().subscribe(function (d) {
            d.collection(coleccion).findOne(atributos, function (err, result) {
                assert.equal(err, null);
                callback(result);
            });
        });
    };
    Bd.prototype.Borrar = function (coleccion, atributos) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar()
                .subscribe(function (d) {
                d.collection(coleccion).deleteMany(atributos, function (err, result) {
                    ob.next(result);
                });
            });
        });
    };
    Bd.prototype.getFilterDocuments = function (coleccion, atributos, callback) {
        this.conectar().subscribe(function (d) {
            d.collection(coleccion)
                .find(atributos)
                .toArray(function (err, docs) {
                assert.equal(err, null);
                callback(docs);
            });
        });
    };
    Bd.prototype.insertOneDoc = function (nombcol, doc, callback) {
        this.conectar().subscribe(function (d) {
            d.collection(nombcol)
                .insertOne(doc, function (err, result) {
                assert.equal(err, null);
                callback(result);
            });
        });
    };
    Bd.prototype.insertarUnDocumento = function (coleccion, doc) {
        var _this = this;
        return new rxjs_1.Observable(function (ob) {
            _this.conectar().subscribe(function (d) {
                d.collection(coleccion)
                    .insertOne(doc, function (err, result) {
                    assert.equal(err, null);
                    ob.next(result);
                });
            });
        });
    };
    Bd.prototype.insertDocuments = function (nombreColeccion, documentos, callback) {
        this.conectar().subscribe(function (d) {
            d.collection(nombreColeccion)
                .insertMany(documentos, function (err, result) {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                assert.equal(3, result.ops.length);
                callback(result);
            });
        });
    };
    return Bd;
}());
var db = new Bd();
exports.default = db;
