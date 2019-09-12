import { switchMap, tap } from 'rxjs/operators';
import modelo from '../coins-responses';

import getSampleData from '../../coinmarketdata/getsampledata.function';

const responseCoinMarket = getSampleData();

responseCoinMarket.status.timestamp = new Date();

const testInsertOne = modelo.insertOne(responseCoinMarket)
.pipe(
  switchMap((resInsert) => modelo.delMany({_id: resInsert.insertedId})),
)
.pipe(tap((resDelMany) => console.log('insertOne-->delMany --> ok', resDelMany.result)));

export default testInsertOne;
