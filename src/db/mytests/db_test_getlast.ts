import db from '../db';
import dbfact$ from '../db.factory';
import {mergeMap} from 'rxjs/operators';

const col = 'responses';

dbfact$
.pipe(
	mergeMap((dbfact) => db.getHistory(dbfact, col, 2),
		(dbf, history) => ({db, history})),
	mergeMap((input) => db.getLast(input.dbf, col),
		(input, last) => ({history: input.history, last})),
	)
.subscribe((input) => {
  console.log('result gethistory: ', input.history);
  console.log('result last: ', input.last);
});



// db.getLast(col)
// .subscribe((result) => {
//   console.log('getlast: ', result);
// })
