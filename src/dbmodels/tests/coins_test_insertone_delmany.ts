import { switchMap } from 'rxjs/operators';
import modelo from '../coins-responses';

import getSampleData from '../../coinmarketdata/getsampledata.function';

const responseCoinMarket = getSampleData();

responseCoinMarket.status.timestamp = new Date();

modelo.insertOne(responseCoinMarket)
.pipe(
  switchMap((resInsert) => modelo.delMany({_id: resInsert.insertedId})),
)
.subscribe((resDelMany) => {
  // console.log('objeto DeleteWriteOpResultObject.result: \n', result.result);
  // console.log('insertarUno_borrarMuchos: ok');
  console.log('insertOne-->delMany --> ok', resDelMany.result);
});
