import { switchMap, tap } from 'rxjs/operators';

import modelo from '../coins-responses';

import getSampleData from '../../coinmarketdata/getsampledata.function';

const respDoc = getSampleData();

const testInsertOneDelByMongoid = modelo.insertOne(respDoc)
.pipe(
  switchMap((respInsert) => {
    return modelo.delByMongoId(respInsert.insertedId);
  }),
)
.pipe(tap((respDel) => {
  console.log('insertOne-->delByMongoId --> ok ', respDel.result);
}));

export default testInsertOneDelByMongoid;
