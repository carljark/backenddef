import * as assert from 'assert';
import {
  Binary,
  Code,
  Collection,
  Cursor,
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
import { Observable, Subscriber } from 'rxjs';

class Bd {
  public host = 'localhost';
  public port = 27017;
  public url = 'mongodb://localhost:27017/backenddef';
  public dbname = 'backenddef';

  public mongoFindLasts = async (cursor: Cursor, ob: Subscriber<object>, limit: number) => {
    let i = 0;
    while (await cursor.hasNext() && i < limit) {
      i++;
      const doc: object = await cursor.next();
      ob.next(doc);
    }
    ob.complete();
  }

  public connect(): Observable<MongoClient> {
    return new Observable((observer) => {
      MongoClient.connect(this.url, { useNewUrlParser: true }, (err, client) => {
        assert.equal(null, err);
        observer.next(client);
      });
    });
  }
  public getHistory(collectionName: string, limit: number): Observable<object> {
    return new Observable<any>((ob) => {
      this.connect()
      .subscribe((client) => {
        const cursor = client.db(this.dbname)
        .collection(collectionName)
        .find({}).sort({_id: -1});
        this.mongoFindLasts(cursor, ob, limit);
        // ob.complete();
        client.close();
      });
    });
  }
  public getAll(collectionName: string): Observable<any[]> {
    return new Observable<any[]>((ob) => {
      this.connect()
      .subscribe((cliente) => {
        cliente.db(this.dbname).collection(collectionName)
        .find({}).toArray( (err, docs) => {
          assert.equal(err, null);
          ob.next(docs);
          cliente.close();
        });
      });
    });
  }
  public getMany(coleccion: string, atributos: object): Observable<object[]> {
    return new Observable((ob) => {
      this.connect()
      .subscribe((cliente) => {
        cliente.db(this.dbname).collection(coleccion)
        .find(atributos).toArray((error, docs) => {
          ob.next(docs);
          cliente.close();
        });
      });
    });
  }
  public getOne(coleccion: string, atributos: object): Observable<object> {
    return new Observable<object>((ob) => {
      this.connect()
      .subscribe((cliente) => {
        cliente.db(this.dbname).collection(coleccion)
        .findOne(atributos, (err, result) => {
          assert.equal(err, null);
          ob.next(result);
          cliente.close();
        });
      });
    });
  }
  public getByMongoId(collection: string, idMongo: ObjectId): Observable<object> {
    return new Observable<object>((ob) => {
      this.connect()
      .subscribe((client) => {
        client.db(this.dbname)
        .collection(collection)
        .findOne({_id: idMongo}, (error: MongoError, result) => {
          assert.equal(error, null);
          ob.next(result);
          client.close();
        });
      });
    });
  }
  public getAllCollections(): Observable<any[]> {
    return new Observable((ob) => {
      this.connect()
      .subscribe((cliente) => {
        cliente.db(this.dbname).listCollections({} , {nameOnly: true}).toArray((err, colecciones) => {
          assert.equal(err, null);
          ob.next(colecciones);
          cliente.close();
        });
      });
    });
  }
  public insertOne(coleccion: string, doc: object): Observable<InsertOneWriteOpResult> {
    return new Observable<InsertOneWriteOpResult>((ob) => {
      this.connect().subscribe((cliente) => {
        cliente.db(this.dbname).collection(coleccion)
        .insertOne(doc, (err, result) => {
          assert.equal(err, null);
          ob.next(result);
          cliente.close();
        });
      });
    });
  }
  public insertMany(nombreColeccion: string, documentos: object[]): Observable<InsertWriteOpResult> {
    return new Observable<InsertWriteOpResult>((ob) => {
      this.connect().subscribe((cliente) => {
        cliente.db(this.dbname).collection(nombreColeccion)
        .insertMany(documentos , (err, result) => {
          assert.equal(err, null);
          assert.equal(3, result.result.n);
          assert.equal(3, result.ops.length);
          ob.next(result);
          cliente.close();
        });
      });
    });
  }
  public delMany(coleccion: string, atributos: object): Observable<DeleteWriteOpResultObject> {
    return new Observable<DeleteWriteOpResultObject>((ob) => {
      this.connect()
      .subscribe((cliente) => {
        cliente.db(this.dbname)
        .collection(coleccion).deleteMany(atributos, (err, result: DeleteWriteOpResultObject) => {
          ob.next(result);
          cliente.close();
        });
      });
    });
  }
  public delByMongoId(collection: string, idMongo: ObjectId) {
    return new Observable<DeleteWriteOpResultObject>((ob) => {
      this.connect()
      .subscribe((client) => {
        client.db(this.dbname)
        .collection(collection)
        .deleteOne({_id: idMongo}, (error: MongoError, result: DeleteWriteOpResultObject) => {
          ob.next(result);
          client.close();
        });
      });
    });
  }
  public delAll(col: string): Observable<DeleteWriteOpResultObject> {
    return new Observable((ob) => {
      this.connect().subscribe((cliente) => {
        cliente.db(this.dbname).collection(col)
        .deleteMany({}, (err, result) => {
          ob.next(result);
          cliente.close();
        });
      });
    });
  }
  private printtojson(data: any) {
    console.log(JSON.stringify(data));
  }
}
const db = new Bd();
export default db;
