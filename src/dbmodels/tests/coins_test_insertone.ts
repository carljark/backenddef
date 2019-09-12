import { tap } from 'rxjs/operators';
import modelo from '../coins-responses';

import getSampleData from '../../coinmarketdata/getsampledata.function';

const responseCoinMarket = getSampleData();

responseCoinMarket.status.timestamp = new Date();

// TODO: coger el closeclient del argumento en la línea de comandos
const testInsertOne = modelo.insertOne(responseCoinMarket, {closeClient: false})
.pipe(
  tap((result) => console.log('insertOne --> ok: result', result.result)),
);
export default testInsertOne;
