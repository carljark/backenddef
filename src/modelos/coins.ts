import {
  BulkWriteOpResultObject,
  CommandCursorResult,
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  OrderedBulkOperation,
  WriteOpResult,
} from 'mongodb';
import { Observable } from 'rxjs';
import db from '../db/db';
// console.log('db: ', db);

import coin from '../coinmarketdata/simplecoin.interface';
class InterfazCoins {
  public static init(): InterfazCoins {
    return new InterfazCoins();
  }
  public nombreColeccion = 'responses';
  constructor() {
    console.log('constructor de InterfazCoins');
  }
  public getById(Id: string): Observable<coin> {
    const coinId = {
      Id,
    };
    console.log('coinId', coinId);
    return this.getOneCoin(coinId);
  }
  public borrarTodos(): Observable<DeleteWriteOpResultObject> {
    return db.borrarTodos(this.nombreColeccion);
  }
  public borrarMuchos(atributos: object): Observable<DeleteWriteOpResultObject> {
    return db.Borrar(this.nombreColeccion, atributos);
  }
  public buscarPorAtributos(atributos: object): Observable<object[]> {
    return new Observable((ob) => {
      db.buscarPorAtributos(this.nombreColeccion, atributos)
      .subscribe((result) => {
        ob.next(result);
      });
    });
  }
  public conseguirTodos(): Observable<object[]> {
    return this.buscarPorAtributos({});
  }
  public getOneCoin(atributos: object): Observable<coin> {
    console.log('atributos en getOneCoin: ', atributos);
    return new Observable((observer) => {
      db.getOneDocByFilter(this.nombreColeccion, atributos)
      .subscribe((result) => {
        console.log('result: ', result);
        observer.next(result);
      });
    });
  }
  public insertOneResponse(coinsResponse: object): Observable<InsertOneWriteOpResult> {
    return new Observable((observer) => {
      // sustituir [] por un Array<Object> u otro más apropiado
      db.insertOneDoc(this.nombreColeccion, coinsResponse, (result: InsertOneWriteOpResult) => {
        // console.log('en la clase: ', true);
        observer.next(result);
      });
    });
  }
  public insertarMuchos(nombre: string, pass: string): Observable<boolean> {
    return new Observable((observer) => {
      // sustituir [] por un Array<Object> u otro más apropiado
      db.insertDocuments(this.nombreColeccion, [], (result: InsertWriteOpResult) => {
        // console.log('result en la clase: ', result);
        observer.next(true);
      });
    });
  }
}
const modelo = InterfazCoins.init();
export default modelo;
