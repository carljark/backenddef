import * as assert from 'assert';
import {
  Cursor,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoClient,
  MongoError,
  ObjectId,
} from 'mongodb';

import { from, Observable, of, Subscriber, Subscription } from 'rxjs';

import {map, switchMap, tap} from 'rxjs/operators';

import bdf$ from './db.factory';

interface IDbResult {
  cli: MongoClient;
  db: Db;
  result: any[]|any;
}

export class Bd {
  private bdfact$ = bdf$;

  public insertOne(coleccion: string, doc: object): Observable<IDbResult> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(coleccion).insertOne(doc),
      (input, result) => ({...input, result})),
    );
  }

  public mongoFindLasts = async (cursor: Cursor, ob: Subscriber<object>, limit: number) => {
    let i = 0;
    while (await cursor.hasNext() && i < limit) {
      i++;
      const doc: object = await cursor.next();
      ob.next(doc);
    }
    ob.complete();
  }

  public getLast(collectionName: string): Observable<IDbResult> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(collectionName)
        .find({}).sort({'status.timestamp': -1}).limit(1).toArray(),
      (input, array) => ({...input, result: array[0]})),
    );
  }

  public getHistory(collectionName: string, limit: number): Observable<object> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => {
        return new Observable<object>((observer) => {
          const cursor = clidb.db.collection(collectionName)
          .find({}).sort({_id: -1});
          this.mongoFindLasts(cursor, observer, limit);
        })
      })
      )
  }

  public getLastFromPromised(collectionName: string): Observable<object> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(collectionName)
      .find({}).sort({'status.timestamp': -1}).limit(1).toArray()),
      map((array) => array[0]),
    )
  }


  public getAll(collectionName: string): Observable<{cli: MongoClient, db: Db, docs: any[]}> {
    return this.bdfact$
    .pipe(
      switchMap((bdfact) => {
        return bdfact.db.collection(collectionName)
          .find({}).toArray();
      }, (input, docs) => ({...input, docs})),
    );
  }

  public getMany(coleccion: string, atributos: object): Observable<object[]> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(coleccion).find(atributos).toArray())
      )
  }

  public getOne(coleccion: string, atributos: object): Observable<object> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(coleccion).findOne(atributos)),
    );
  }

  public getByMongoId(collection: string, idMongo: ObjectId): Observable<object> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(collection).findOne({_id: idMongo})),
    );
      
  }

  public getAllCollections(): Observable<{cli: MongoClient, db: Db, collections: any[]}> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.listCollections({} , {nameOnly: true}).toArray(),
        (input, collections) => ({...input, collections})),
    );
      
  }

  public insertMany(nombreColeccion: string, documentos: object[]): Observable<InsertWriteOpResult> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(nombreColeccion).insertMany(documentos)),
    );
      
  }

  public delMany(coleccion: string, atributos: object): Observable<DeleteWriteOpResultObject> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(coleccion).deleteMany(atributos)),
    );
  }

  public delByMongoId(collection: string, idMongo: ObjectId) {
    return this.bdfact$
    .pipe(switchMap((clidb) => clidb.db.collection(collection).deleteOne({_id: idMongo})));
  }

  public delAll(col: string): Observable<IDbResult> {
    return this.bdfact$
    .pipe(
      switchMap((clidb) => clidb.db.collection(col).deleteMany({}),
        (input, result) => ({...input, result})),
    );
  }

  public delCollection(col: string): Observable<IDbResult> {
    return this.bdfact$
    .pipe(switchMap((clidb) => clidb.db.collection(col).drop(),
      (input, result) => ({...input, result})),
    );
  }

  public createIndex(col: string): Observable<string> {
    return this.bdfact$
    .pipe(switchMap((clidb) => clidb.db.collection(col).createIndex({id: 1})));
      
  }
}
const db = new Bd();
export default db;
