import { tap } from 'rxjs/operators';
import modelo from '../coins-responses';

const testGetHistoryByCount = modelo.getHistoryByCount(1)
.pipe(
  tap((history) => console.log('getHistoryByCount --> ok', history._id)),
);

export default testGetHistoryByCount;
