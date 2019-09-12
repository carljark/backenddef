import { tap } from 'rxjs/operators';
import modelo from '../coins-responses';

// precios desde una fecha concreta
// hasta un minuto antes
// const endDate = (new Date('2019-08-02T15:45:10.845Z'));
const endDate = (new Date());

const testGetHistoryFromDateToMinsAndName = modelo.getHistoryFromDateToMinsAndName(endDate, 30, 'bitcoin')
.pipe(
  tap((history) => console.log('getHistoryFromDateToMinsAndName --> ok', history.timePriceArray.length)),
);

export default testGetHistoryFromDateToMinsAndName;
