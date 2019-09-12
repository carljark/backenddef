import {from} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import db$ from '../db.factory';

db$
.pipe(
  // switchMap((db) => from(db.admin().serverStatus())),
  switchMap((clidb) => from(clidb.db.command({dbStats: 1, scale: 1024}))),
)
.subscribe((dbStats) => {
  console.log(dbStats);
  console.log('info.datasize', dbStats.dataSize);

    // db.admin().serverStatus()
    // .then((info) => {
    //     console.log(info.connections);
    // });
});
