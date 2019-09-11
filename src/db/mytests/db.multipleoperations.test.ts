import {
    mergeMap,
    switchMap,
} from 'rxjs/operators';
import getData$ from '../../coinmarketdata/getdata.function';
import dbMo from '../db';
import db$ from '../db.factory';

db$
.pipe(
  mergeMap((db) => getData$(),
    (db, dataToInsert) => ({db, dataToInsert})),
  switchMap((cliDataInsert) => dbMo.insertOne(
      cliDataInsert.db, 'responses', cliDataInsert.dataToInsert),
    (dbAndDoc) => ({db: dbAndDoc.db, doc: dbAndDoc.dataToInsert})),
  switchMap((dbAndDoc) => {
    return dbMo.getLast(dbAndDoc.db, 'responses');
  },
    (dbAndDoc, lastres) => ({db: dbAndDoc.db, doc: dbAndDoc.doc , lastres})),
  mergeMap((dbAndRes) => {
    console.log('getLast: ', dbAndRes.lastres);
    return dbMo.delAll(dbAndRes.db, 'responses');
  },
    (dbAndRes, resDel) => ({db: dbAndRes.db, doc: dbAndRes.doc, resDel})),
  switchMap((dbAndResdel) => dbMo.insertOne(dbAndResdel.db, 'responses', dbAndResdel.doc),
    (dbDocDel) => ({db: dbDocDel.db, resDel: dbDocDel.resDel}) ),
)
.subscribe((dbResDel) => {
    console.log(dbResDel.resDel.result);
});

db$
.pipe(
    mergeMap((db) => getData$(), (db, doc) => ({db, doc})),
    switchMap((dbAndDoc) => dbMo.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc), (dAndDoc) => (dAndDoc.db)),
    switchMap((db) => dbMo.getLastFromPromised(db, 'responses'), (db, array) => ({db, array})),
)
.subscribe((cliAndArray) => {
    console.log(cliAndArray.array[0]);
});
db$
.pipe(
    mergeMap((db) => getData$(), (db, doc) => ({db, doc})),
    switchMap((dbAndDoc) => dbMo.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc), (dAndDoc) => (dAndDoc.db)),
    switchMap((db) => dbMo.getLastFromPromised(db, 'responses'), (db, array) => ({db, array})),
)
.subscribe((cliAndArray) => {
    console.log(cliAndArray.array[0]);
});
