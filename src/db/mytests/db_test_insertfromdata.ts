import {mergeMap, switchMap, finalize} from 'rxjs/operators';
import getData from '../../coinmarketdata/getdata.function';
import db, {Bd} from '../db';
Bd.client$
.pipe(
    mergeMap(() => getData()),
    switchMap((data) => db.insertOne('responses', data)),
    switchMap((result) => Bd.client$),
)
.subscribe((cli) => {
    console.log('cli: ', cli);
    cli.close().then((joder) => {
        console.log('joder: ', joder);
    });
})
.unsubscribe();
