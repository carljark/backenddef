import {
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult,
  MongoClient,
  ObjectId,
} from 'mongodb';
import { Observable } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import dbMo from '../db/db';
import db$ from '../db/db.factory';
import { IResp, IRespDb } from '../interfaces/response-simplified.interface';

import {ICoinHistory, ITimePrice} from '../interfaces/coin-history.interface';

class InterfazCoins {
  public static init(): InterfazCoins {
    return new InterfazCoins();
  }

  public collectionName = 'responses';

  public insertOne(coinsResponse: IResp, options?: {closeClient: boolean}): Observable<InsertOneWriteOpResult> {
    let client: MongoClient;
    return dbMo.insertOne(this.collectionName, coinsResponse)
    .pipe(
      map((input) => {
        client = input.cli;
        return input.result;
      }),
      tap(() => {
        if (options && options.closeClient === true) {
          client.close();
        }
      }),
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
    return dbMo.getMany(this.collectionName, filter)
    .pipe(
      map((result) => result as IRespDb[]),
    );
  }
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

  public getLast(): Observable<IRespDb> {
    return dbMo.getLast(this.collectionName)
    .pipe(
      map((clidbResult) => clidbResult.result),
    );
  }

  // a partir de aquí no se usan los métodos en la aplicación

  public getAll(): Observable<IRespDb[]> {
    return dbMo.getAll(this.collectionName)
    .pipe(
      map((res) => res.docs as IRespDb[]),
    );
  }
  public getOne(attrib: object): Observable<IRespDb> {
    return dbMo.getOne(this.collectionName, attrib)
    .pipe(
      map((object) => object as IRespDb),
    );
  }
  public getByMongoId(idMongo: ObjectId): Observable<IRespDb> {
    return dbMo.getByMongoId(this.collectionName, idMongo)
    .pipe(
      map((res) => res as IRespDb),
    );
  }
  /**
   * Emite una cadena de respuestas, no una matriz.
   * @param limit límite de emisiones de IRespDb
   */
  public getHistoryByCount(limit: number): Observable<IRespDb> {
    return dbMo.getHistory(this.collectionName, limit)
    .pipe(
      map((historyobject) => historyobject as IRespDb),
    );
  }
  /**
   * Devuelve un objeto con el name y un array con el timestamp y el price
   * @param endDate Fecha tope
   * @param mins Minutos a contar hacia atrás
   * @param name nombre de la moneda a localizar
   */

  public getMany(attribs: object): Observable<IResp[]> {
    return dbMo.getMany(this.collectionName, attribs)
    .pipe(
      map((result) => result as IResp[]),
    );
  }
  public delAll(options?: {closeClient: boolean}): Observable<DeleteWriteOpResultObject> {
    let client: MongoClient;
    return dbMo.delAll(this.collectionName)
    .pipe(
      map((dbresult) => {
        client = dbresult.cli;
        return dbresult.result;
      }),
      tap(() => {
        if (options && options.closeClient === true) {
          client.close();
        }
      }),
    )
  }
  public delMany(atributos: object): Observable<DeleteWriteOpResultObject> {
    return dbMo.delMany(this.collectionName, atributos);
  }
  public delByMongoId(idMongo: ObjectId): Observable<DeleteWriteOpResultObject> {
    return dbMo.delByMongoId(this.collectionName, idMongo);
  }
  public insertMany(respCoinsArray: IResp[]): Observable<InsertWriteOpResult> {
    return dbMo.insertMany(this.collectionName, respCoinsArray);
  }
}
const modelo = InterfazCoins.init();
export default modelo;
