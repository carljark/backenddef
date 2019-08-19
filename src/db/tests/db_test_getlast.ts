import db from '../db';

const col = 'responses';

db.getHistory(col, 2)
.subscribe((result) => {
  console.log('result gethistory: ', result);
});
db.getLast(col)
.subscribe((result) => {
  console.log('getlast: ', result);
})
