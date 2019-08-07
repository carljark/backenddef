import {
  BulkWriteOpResultObject,
  CommandCursorResult,
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  ObjectId,
  OrderedBulkOperation,
  WriteOpResult,
} from 'mongodb';
import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import db from '../db/db';
import { IResp, IRespDb } from './responsesimple.interface';

import {ICoinHistory, ITimePrice} from '../coinmarketdata/coin-history.interface';

class InterfazCoins {
  public static init(): InterfazCoins {
    return new InterfazCoins();
  }
  
  public collectionName = 'responses';
  public getAll(): Observable<IRespDb[]> {
    return db.getAll(this.collectionName)
    .pipe(
      map((res) => res as IRespDb[]),
    );
  }
  public getOne(attrib: object): Observable<IRespDb> {
    return db.getOne(this.collectionName, attrib)
    .pipe(
      map((object) => object as IRespDb),
    );
  }
  public getByMongoId(idMongo: ObjectId): Observable<IRespDb> {
    return db.getByMongoId(this.collectionName, idMongo)
    .pipe(
      map((res) => res as IRespDb),
    );
  }
  public getLast(): Observable<IRespDb> {
    return this.getHistoryByCount(1);
  }
  /**
   * Emite una cadena de respuestas, no una matriz.
   * @param limit límite de emisiones de IRespDb
   */
  public getHistoryByCount(limit: number): Observable<IRespDb> {
    return db.getHistory(this.collectionName, limit)
    .pipe(
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
    return db.getMany(this.collectionName, filter)
    .pipe(
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
    return db.getMany(this.collectionName, attribs)
    .pipe(
      map((result) => result as IResp[]),
    );
  }
  public delAll(): Observable<DeleteWriteOpResultObject> {
    return db.delAll(this.collectionName);
  }
  public delMany(atributos: object): Observable<DeleteWriteOpResultObject> {
    return db.delMany(this.collectionName, atributos);
  }
  public delByMongoId(idMongo: ObjectId): Observable<DeleteWriteOpResultObject> {
    return db.delByMongoId(this.collectionName, idMongo);
  }
  public insertOne(coinsResponse: object): Observable<InsertOneWriteOpResult> {
    return db.insertOne(this.collectionName, coinsResponse);
  }
  public insertMany(respCoinsArray: IResp[]): Observable<boolean> {
    return db.insertMany(this.collectionName, respCoinsArray)
    .pipe(
      mapTo(true),
    );
  }
}
const modelo = InterfazCoins.init();
export default modelo;
