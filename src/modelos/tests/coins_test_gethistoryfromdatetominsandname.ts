import modelo from '../coins-responses';

// precios desde una fecha concreta
// hasta un minuto antes
// const endDate = (new Date('2019-08-02T15:45:10.845Z'));
const endDate = (new Date());

modelo.getHistoryFromDateToMinsAndName(endDate, 1, 'bitcoin')
.subscribe((history) => {
  console.log('getHistoryFromDateToMinsAndName --> ok', history.timePriceArray.length);
});
