import * as assert from 'assert';
import {
  Db,
  MongoClient,
} from 'mongodb';
import {from, Observable} from 'rxjs';

import {map, tap} from 'rxjs/operators';
import config from '../environment';

const url = `mongodb://${config.databaseConfig.host}:27017`;

export class BdFact {

  public static db: Observable<Db> = BdFact.connect();

  public static connect(): Observable<Db> {
    return from(MongoClient.connect(url, { bufferMaxEntries: 0, useNewUrlParser: true}))
    .pipe(
      map((cli) => cli.db(config.databaseConfig.database)),
    );
  }
}
const db = BdFact.db;
export default db;
