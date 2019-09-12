import {
    mergeMap,
    switchMap,
} from 'rxjs/operators';
import getData$ from '../../coinmarketdata/getdata.function';
import dbMo from '../db';


getData$()
.pipe(
  switchMap((lastCoinsResponse) => dbMo.insertOne('responses', lastCoinsResponse),
    lastCoinsResponse => lastCoinsResponse),
  switchMap(() => dbMo.getLast('responses'),
    lastCoinsResponse => lastCoinsResponse),
  mergeMap(() => dbMo.delAll('responses'),
    (lastCoinsResponse, delResult) => ({lastCoinsResponse, delResult})),
  switchMap((input) => dbMo.insertOne('responses', input.lastCoinsResponse),
    (input) => input.delResult),
)
.subscribe((delResult) => {
    console.log(delResult.result);
});

getData$()
.pipe(
    switchMap((lastCoinsResponse) => dbMo.insertOne('responses', lastCoinsResponse)),
    switchMap(() => dbMo.getLastFromPromised('responses')),
)
.subscribe((lastFromDb) => {
    console.log(lastFromDb);
});


getData$()
.pipe(
    switchMap((lastCoinsResponse) => dbMo.insertOne('responses', lastCoinsResponse)),
    switchMap(() => dbMo.getLastFromPromised('responses')),
)
.subscribe((lastFromDb) => {
    console.log(lastFromDb);
});
