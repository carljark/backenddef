import {
  Db,
  MongoClient,
} from 'mongodb';
import {from, Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import config from '../environment';

const url = `mongodb://${config.databaseConfig.host}:27017`;

export class BdFact {

  public static db: Observable<{cli: MongoClient, db: Db}> = BdFact.connect();

  public static connect(): Observable<{cli: MongoClient, db: Db}> {
    return from(
      MongoClient.connect(url,
        {
          bufferMaxEntries: 0,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }))
    .pipe(
      map((cli) => {
        return {
          cli,
          db: cli.db(config.databaseConfig.database),
        };
      }),
    );
  }
}
const db = BdFact.db;
export default db;
