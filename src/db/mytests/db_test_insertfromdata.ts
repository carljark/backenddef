import {mergeMap, switchMap, finalize} from 'rxjs/operators';
import getData from '../../coinmarketdata/getdata.function';
import db from '../db';

getData()
.pipe(
    switchMap((lastCoinsResponse) => db.insertOne('responses', lastCoinsResponse)),
)
.subscribe((resInsert) => {
	console.log('resInsert.ops: ', resInsert.ops);
});

