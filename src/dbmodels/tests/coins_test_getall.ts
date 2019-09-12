import { tap } from 'rxjs/operators';
import modelo from '../coins-responses';

const testGetAll = modelo.getAll()
.pipe(tap((result) => {
  // console.log('datos buscados: \n', datos);
  console.log('getAll --> ok', result.length);
  result.forEach((re) => {
    console.log(re._id);
  });
}));

export default testGetAll;
