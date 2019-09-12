import {
    mergeMap,
    switchMap,
} from 'rxjs/operators';
import getData$ from '../../coinmarketdata/getdata.function';
import dbinterfaz from '../db';

const dataSample = getData$();

dataSample
.pipe(
  switchMap((lastCoinsResponse) => dbinterfaz.insertOne('responses', lastCoinsResponse)),
  switchMap(() => dbinterfaz.getLast('responses')),
  mergeMap((lastFromDb) => dbinterfaz.delAll('responses')),
 )
.subscribe((delRes) => {
    console.log(delRes.result);
});
