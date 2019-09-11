import {
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectId,
} from 'mongodb';
import { Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import dbMo from '../db/db';
import db$ from '../db/db.factory';
import { IResp, IRespDb } from '../interfaces/response-simplified.interface';

import {ICoinHistory, ITimePrice} from '../interfaces/coin-history.interface';

class InterfazCoins {
  public static init(): InterfazCoins {
    return new InterfazCoins();
  }

  public collectionName = 'responses';
  public getAll(): Observable<IRespDb[]> {
    return db$
    .pipe(
      switchMap((db) => dbMo.getAll(db, this.collectionName)),
      map((res) => res as IRespDb[]),
    );
  }
  public getOne(attrib: object): Observable<IRespDb> {
    return db$
    .pipe(
      switchMap((db) => dbMo.getOne((db), this.collectionName, attrib)),
      map((object) => object as IRespDb),
    );
  }
  public getByMongoId(idMongo: ObjectId): Observable<IRespDb> {
    return db$
    .pipe(
      switchMap((db) => dbMo.getByMongoId((db), this.collectionName, idMongo)),
      map((res) => res as IRespDb),
    );
  }
  public getLast(): Observable<IRespDb> {
    // return this.getHistoryByCount(1);
    return db$
    .pipe(
      switchMap((db) => dbMo.getLast((db), this.collectionName)),
      map((respOb) => respOb as IRespDb),
    );
  }
  /**
   * Emite una cadena de respuestas, no una matriz.
   * @param limit límite de emisiones de IRespDb
   */
  public getHistoryByCount(limit: number): Observable<IRespDb> {
    return db$
    .pipe(
      switchMap((db) => dbMo.getHistory((db), this.collectionName, limit)),
      map((historyobject) => historyobject as IRespDb),
    );
  }
  /**
   * Devuelve todas las respuestas
   * guardadas en la coleccion responses
   * en formato [{status: status, data: array},...]
   * @param dateInit Fecha inicial
   * @param dateEnd Fecha Final
   */
  public getByDateRange(dateInit: Date, dateEnd: Date): Observable<IRespDb[]> {
    const filter = {
      'status.timestamp': {
        $gt: dateInit,
        $lt: dateEnd,
      },
    };
    return db$
    .pipe(
      switchMap((db) => dbMo.getMany((db), this.collectionName, filter)),
      map((result) => result as IRespDb[]),
    );
  }
  /**
   * Devuelve un objeto con el name y un array con el timestamp y el price
   * @param endDate Fecha tope
   * @param mins Minutos a contar hacia atrás
   * @param name nombre de la moneda a localizar
   */
  public getHistoryFromDateToMinsAndName(endDate: Date, mins: number, name: string): Observable<ICoinHistory> {
    const MS_PER_MINUTE = 60000;
    // quitar para production
    // const nowDate = (new Date()).valueOf();
    return this.getByDateRange(new Date(endDate.valueOf() - mins * MS_PER_MINUTE), endDate)
    .pipe(
      map((result: IRespDb[]) => {
        // voy a filtrar la matriz de la
        // propiedad data para que solo
        // estén los datos de name (el nombre de la coin)
        const timePriceArray = new Array<ITimePrice>();
        // como es un callback habrá que usar await
        // en una función async, quizás
        result.forEach((res) => {
          const dx = res.data.findIndex((co) => {
            return co.name === name;
          });
          timePriceArray.push({
            price: res.data[dx].price,
            timestamp: res.status.timestamp,
          });
        });

        const coinHistory: ICoinHistory = {
          name,
          timePriceArray,
        };
        return coinHistory;
      }),
    );

  }
  public getMany(attribs: object): Observable<IResp[]> {
    return db$
    .pipe(
      switchMap((db) => dbMo.getMany((db), this.collectionName, attribs)),
      map((result) => result as IResp[]),
    );
  }
  public delAll(): Observable<DeleteWriteOpResultObject> {
    return db$
    .pipe(
      switchMap((db) => dbMo.delAll((db), this.collectionName)),
    );
  }
  public delMany(atributos: object): Observable<DeleteWriteOpResultObject> {
    return db$
    .pipe(switchMap((db) => dbMo.delMany((db), this.collectionName, atributos)));
  }
  public delByMongoId(idMongo: ObjectId): Observable<DeleteWriteOpResultObject> {
    return db$.pipe(switchMap((db) => dbMo.delByMongoId((db), this.collectionName, idMongo)));
  }
  public insertOne(coinsResponse: IResp): Observable<InsertOneWriteOpResult> {
    return db$.pipe(switchMap((db) => dbMo.insertOne((db), this.collectionName, coinsResponse)));
  }
  public insertMany(respCoinsArray: IResp[]): Observable<boolean> {
    return db$
    .pipe(
      switchMap((db) => dbMo.insertMany((db), this.collectionName, respCoinsArray)),
      mapTo(true),
    );
  }
}
const modelo = InterfazCoins.init();
export default modelo;
