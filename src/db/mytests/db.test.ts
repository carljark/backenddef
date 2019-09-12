import {
    mergeMap,
    switchMap,
} from 'rxjs/operators';
import getData$ from '../../coinmarketdata/getdata.function';
import dbinterfaz from '../db';
import db$ from '../db.factory';

const dataSample = getData$();

db$
.pipe(
  mergeMap((db) => dataSample,
    (db, doc) => ({db, doc})),
  switchMap((dbAndDoc) => dbinterfaz.insertOne(
      dbAndDoc.db, 'responses', dbAndDoc.doc),
    (cliDataInsert) => cliDataInsert.db),
  switchMap((db) => {
    return dbinterfaz.getLast(db, 'responses');
  },
    (db, lastres) => ({db, lastres})),
  mergeMap((dbAndRes) => {
    console.log(dbAndRes.lastres);
    return dbinterfaz.delAll(dbAndRes.db, 'responses');
  },
    (dbAndRes, resDel) => ({db: dbAndRes.db, resDel})),
)
.subscribe((dbAndDel) => {
    console.log(dbAndDel.resDel.result);
});
