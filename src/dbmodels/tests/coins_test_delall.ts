import { tap } from 'rxjs/operators';
import usuarios from '../coins-responses';
const testDelAll = usuarios.delAll({closeClient: true})
.pipe(tap((resborrar) => console.log('delAll --> ok', resborrar.result)));

export default testDelAll;
