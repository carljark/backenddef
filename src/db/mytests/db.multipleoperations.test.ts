import {
    mergeMap,
    switchMap,
} from 'rxjs/operators';
import getData$ from '../../coinmarketdata/getdata.function';
import dbMo from '../db';

getData$()
.pipe(
  switchMap((cliDataInsert) => dbMo.insertOne('responses', cliDataInsert), (doc) => doc),
  switchMap(() => dbMo.getLast('responses'), (doc) => doc),
  mergeMap(() => dbMo.delAll('responses'), (doc) => doc),
  switchMap((doc) => dbMo.insertOne('responses', doc)),
)
.subscribe((dbResDel) => {
    console.log(dbResDel.result);
});

getData$()
.pipe(
    switchMap((dbAndDoc) => dbMo.insertOne('responses', dbAndDoc)),
    switchMap(() => dbMo.getLastFromPromised('responses')),
)
.subscribe((cliAndArray) => {
    console.log(cliAndArray);
});
