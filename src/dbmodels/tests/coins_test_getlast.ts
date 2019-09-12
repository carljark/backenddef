import { tap } from 'rxjs/operators';
import modelo from '../coins-responses';

const testGetLast = modelo.getLast()
.pipe(tap((result) => console.log('getLast --> ok', result)));

export default testGetLast;
