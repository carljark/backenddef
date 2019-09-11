import * as assert from 'assert';
import {
  Cursor,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoError,
  ObjectId,
} from 'mongodb';

import { from, Observable, Subscriber } from 'rxjs';

export class Bd {

  public mongoFindLasts = async (cursor: Cursor, ob: Subscriber<object>, limit: number) => {
    let i = 0;
    while (await cursor.hasNext() && i < limit) {
      i++;
      const doc: object = await cursor.next();
      ob.next(doc);
    }
    ob.complete();
  }

  public getHistory(d: Db, collectionName: string, limit: number): Observable<object> {
    return new Observable<any>((ob) => {
      const cursor = d.collection(collectionName)
      .find({}).sort({_id: -1});
      this.mongoFindLasts(cursor, ob, limit);
    });
  }

  public getLastFromPromised(d: Db, collectionName: string): Observable<any[]> {
    return from(d.collection(collectionName).find({}).sort({'status.timestamp': -1}).limit(1)
        .toArray());
  }

  public getLast(d: Db, collectionName: string): Observable<object> {
    return new Observable<object>((ob) => {
      d.collection(collectionName).find({}).sort({'status.timestamp': -1}).limit(1)
        .toArray((err, docs) => {
          ob.next(docs[0]);
        });
      });
  }

  public getAll(d: Db, collectionName: string): Observable<any[]> {
    return new Observable<any[]>((ob) => {
      d.collection(collectionName)
        .find({}).toArray( (err, docs) => {
          assert.equal(err, null);
          ob.next(docs);
          ob.complete();
        });
      });
  }

  public getMany(d: Db, coleccion: string, atributos: object): Observable<object[]> {
    return new Observable((ob) => {
      d.collection(coleccion)
        .find(atributos).toArray((error, docs) => {
          ob.next(docs);
        });
      });
  }

  public getOne(d: Db, coleccion: string, atributos: object): Observable<object> {
    return new Observable<object>((ob) => {
      d.collection(coleccion)
        .findOne(atributos, (err, result) => {
          assert.equal(err, null);
          ob.next(result);
        });
      });
  }

  public getByMongoId(d: Db, collection: string, idMongo: ObjectId): Observable<object> {
    return new Observable<object>((ob) => {
      d.collection(collection)
        .findOne({_id: idMongo}, (error: MongoError, result) => {
          assert.equal(error, null);
          ob.next(result);
        });
      });
  }

  public getAllCollections(d: Db): Observable<any[]> {
    return new Observable((ob) => {
      d.listCollections({} , {nameOnly: true}).toArray((err, colecciones) => {
          assert.equal(err, null);
          ob.next(colecciones);
        });
      });
  }

  public insertOne(d: Db, coleccion: string, doc: object): Observable<InsertOneWriteOpResult> {
    return new Observable<InsertOneWriteOpResult>((ob) => {
      d.collection(coleccion)
        .insertOne(doc, (err, result) => {
          assert.equal(err, null);
          ob.next(result);
          // cliente.close();
        });
      });
  }
  public insertMany(d: Db, nombreColeccion: string, documentos: object[]): Observable<InsertWriteOpResult> {
    return new Observable<InsertWriteOpResult>((ob) => {
      d.collection(nombreColeccion)
        .insertMany(documentos , (err, result) => {
          assert.equal(err, null);
          assert.equal(3, result.result.n);
          assert.equal(3, result.ops.length);
          ob.next(result);
        });
      });
  }

  public delMany(d: Db, coleccion: string, atributos: object): Observable<DeleteWriteOpResultObject> {
    return new Observable<DeleteWriteOpResultObject>((ob) => {
      d.collection(coleccion).deleteMany(atributos, (err, result: DeleteWriteOpResultObject) => {
          ob.next(result);
        });
      });
  }

  public delByMongoId(d: Db, collection: string, idMongo: ObjectId) {
    return new Observable<DeleteWriteOpResultObject>((ob) => {
      d.collection(collection)
        .deleteOne({_id: idMongo}, (error: MongoError, result: DeleteWriteOpResultObject) => {
          ob.next(result);
        });
      });
  }

  public delAll(d: Db, col: string): Observable<DeleteWriteOpResultObject> {
    return new Observable((ob) => {
      d.collection(col)
        .deleteMany({}, (err, result) => {
          ob.next(result);
        });
      });
  }

  public delCollection(d: Db, col: string) {
    return new Observable<any>((ob) => {
      d.collection(col)
        .drop(() => {
          ob.next(true);
        });
      });
  }

  public createIndex(d: Db, col: string): Observable<string> {
    return new Observable<string>((ob) => {
      d.collection(col)
        .createIndex(
          {id: 1},
          (error, result) => {
            console.log(result);
            ob.next(result);
          },
        );
      });
  }
}
const db = new Bd();
export default db;
