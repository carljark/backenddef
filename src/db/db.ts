import * as assert from 'assert';
import {
  Binary,
  Code,
  Collection,
  CursorResult,
  Db,
  DeleteWriteOpResultObject,
  FilterQuery,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoCallback,
  MongoClient,
  MongoClientOptions,
  MongoError,
  ObjectId,
  Server,
} from 'mongodb';
import { Observable } from 'rxjs';
import Icoin from '../coinmarketdata/simplecoin.interface';

class Bd {
  // public mgclientoptions: MongoClientOptions;
  public host = 'localhost';
  public port = 27017;
  public url = 'mongodb://localhost:27017/backenddef';
  public dbname = 'backenddef';
  // public usercollection: Collection;
  constructor() {
    console.log('constructor de Bd');
  }

  public conectar(): Observable<Db> {
    return new Observable((observer) => {
      MongoClient.connect(this.url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);
        // console.log('Conectado satisfactoriamente al servidor');
        observer.next(client.db(this.dbname));
        client.close();
      });
    });
  }
  public borrarTodos(col: string): Observable<DeleteWriteOpResultObject> {
    return new Observable((ob) => {
      this.conectar().subscribe((d) => {
        d.collection(col)
        .deleteMany({}, (err, docs) => {
          ob.next(docs);
        });
      });
    });
  }
  public conseguirTodosDocsDeColeccion(col: string): Observable<any> {
    return new Observable((ob) => {
      this.conectar().subscribe((d) => {
        d.collection(col)
        .find({}).toArray((err, docs) => {
          assert.equal(err, null);
          ob.next(docs);
        });
      });
    });
  }
  public conseguirTodasColecciones(): Observable<any[]> {
    return new Observable((ob) => {
      this.conectar().subscribe((d) => {
        d.listCollections({} , {nameOnly: true}).toArray((err, colecciones) => {
          assert.equal(err, null);
          ob.next(colecciones);
        });
      });
    });
  }
  public getOneDocByFilter(collection: string, filter: object): Observable<Icoin> {
    console.log('filtro: ', filter);
    let filtro: FilterQuery<any>;
    filtro = filter;
    return new Observable((ob) => {
      this.conectar().subscribe((d) => {
        // FilterQuery<any>
        d.collection(collection).findOne(filter, (err: MongoError, result) => {
          console.log('result getdocbyfilter: ', result);
          ob.next(result);
        });
      });
    });
  }
  public buscarPorAtributos(coleccion: string, atributos: object): Observable<object[]> {
    return new Observable((ob) => {
      this.conectar().subscribe((d) => {
        d.collection(coleccion)
        .find(atributos).toArray((error, docs) => {
          ob.next(docs);
        });
      });
    });
  }
  public getAllDocuments(callback: (docs: any[]) => void) {
    this.conectar().subscribe((d) => {
      d.collection('documents')
      .find({}).toArray( (err, docs) => {
        assert.equal(err, null);
        callback(docs);
      });
    });
  }
  public getDocbyAtrib(coleccion: string, atributos: object, callback: (result: any) => void) {
    this.conectar().subscribe((d) => {
      d.collection(coleccion).findOne(atributos, (err, result) => {
        assert.equal(err, null);
        callback(result);
      });
    });
  }
  public Borrar(coleccion: string, atributos: object): Observable<DeleteWriteOpResultObject> {
    return new Observable<DeleteWriteOpResultObject>((ob) => {
      this.conectar()
      .subscribe((d) => {
        d.collection(coleccion).deleteMany(atributos, (err, result: DeleteWriteOpResultObject) => {
          ob.next(result);
        });
      });
    });
  }
  public getFilterDocuments(coleccion: string, atributos: object, callback: (docs: any[]) => void) {
    this.conectar().subscribe((d) => {
      d.collection(coleccion)
        .find(atributos)
          .toArray((err, docs) => {
            assert.equal(err, null);
            callback(docs);
          });
    });
  }
  public insertOneDoc(nombcol: string, doc: object, callback: (result: InsertOneWriteOpResult) => void) {
    this.conectar().subscribe((d) => {
      d.collection(nombcol)
      .insertOne(doc, (err, result) => {
        assert.equal(err, null);
        callback(result);
      });
    });
  }
  public insertarUnDocumento(coleccion: string, doc: object): Observable<InsertOneWriteOpResult> {
    return new Observable<InsertOneWriteOpResult>((ob) => {
      this.conectar().subscribe((d) => {
        d.collection(coleccion)
        .insertOne(doc, (err, result) => {
          assert.equal(err, null);
          ob.next(result);
        });
      });
    });
  }
  public insertDocuments(
    nombreColeccion: string,
    documentos: object[],
    callback: (result: InsertWriteOpResult) => void,
    ) {
    this.conectar().subscribe((d) => {
      d.collection(nombreColeccion)
      .insertMany(documentos , (err, result) => {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        callback(result);
      });
    });
  }
}
const db = new Bd();
export default db;
