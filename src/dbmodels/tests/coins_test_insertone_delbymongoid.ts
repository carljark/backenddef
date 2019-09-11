import { switchMap } from 'rxjs/operators';

import modelo from '../coins-responses';

import getSampleData from '../../coinmarketdata/getsampledata.function';

const respDoc = getSampleData();

modelo.insertOne(respDoc)
.pipe(
  switchMap((respInsert) => {
    return modelo.delByMongoId(respInsert.insertedId);
  }),
)
.subscribe((respDel) => {
  console.log('insertOne-->delByMongoId --> ok ', respDel.result);
});
