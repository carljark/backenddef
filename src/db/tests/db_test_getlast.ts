import db from '../db';

const col = 'responses';

db.getHistory(col, 1)
.subscribe((result) => {
  console.log('result: ', result);
});
