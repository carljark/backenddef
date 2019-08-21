import {mergeMap, switchMap} from 'rxjs/operators';
import getData from '../coinmarketdata/getdata.function';
import dbMo from './db';
import db$ from './db.factory';

db$
.pipe(
    mergeMap((db) => getData(), (db, doc) => ({db, doc})),
    switchMap((dbAndDoc) => dbMo.insertOne(dbAndDoc.db, 'responses', dbAndDoc.doc), (dAndDoc) => (dAndDoc.db)),
    switchMap((db) => dbMo.getLastFromPromised(db, 'responses'), (db, array) => ({db, array})),
)
.subscribe((cliAndArray) => {
    console.log(cliAndArray.array[0]);
});
