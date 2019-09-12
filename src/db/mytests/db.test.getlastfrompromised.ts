import {mergeMap, switchMap} from 'rxjs/operators';
import getLastCoinsResponse from '../../coinmarketdata/getdata.function';
import dbMo from '../db';

getLastCoinsResponse()
.pipe(
    switchMap((lastCoinsResponse) => dbMo.insertOne('responses', lastCoinsResponse)),
    switchMap(() => dbMo.getLastFromPromised('responses')),
)
.subscribe((lastFromDb) => {
    console.log(lastFromDb);
});
