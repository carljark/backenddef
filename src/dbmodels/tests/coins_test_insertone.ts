import modelo from '../coins-responses';

import getSampleData from '../../coinmarketdata/getsampledata.function';

const responseCoinMarket = getSampleData();

responseCoinMarket.status.timestamp = new Date();

modelo.insertOne(responseCoinMarket)
.subscribe((result) => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  // console.log('insertarUno --> ok', result.result);
  console.log('insertOne --> ok: result', result.result);
  // console.log('insertarUno --> ok: ops', result.ops);
});
