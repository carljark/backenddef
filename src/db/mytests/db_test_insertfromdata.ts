import {mergeMap, switchMap, finalize} from 'rxjs/operators';
import getData from '../../coinmarketdata/getdata.function';
import db, {Bd} from '../db';
getData()
.pipe(
    switchMap((data) => db.insertOne('responses', data)),
)
.subscribe((cli) => {
    console.log('cli: ', cli);
})
.unsubscribe();
