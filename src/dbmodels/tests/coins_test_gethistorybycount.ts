import modelo from '../coins-responses';

modelo.getHistoryByCount(1)
.subscribe((history) => {
  console.log('getHistoryByCount --> ok', history._id);
});
