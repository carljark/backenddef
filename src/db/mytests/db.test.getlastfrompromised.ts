import {mergeMap, switchMap} from 'rxjs/operators';
import getLastCoinsResponse from '../../coinmarketdata/getdata.function';
import dbMo from '../db';

getLastCoinsResponse()
.pipe(
    switchMap((dbAndDoc) => dbMo.insertOne('responses', dbAndDoc)),
    switchMap(() => dbMo.getLastFromPromised('responses')),
)
.subscribe((lastFromP) => {
    console.log(lastFromP);
});
