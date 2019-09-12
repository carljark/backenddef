import {argv} from 'process';
import { tap } from 'rxjs/operators';

import modelo from '../coins-responses';

let nombreAtributo = 'status.elapsed';
let valorAtributo = 117;

if (argv.length > 3) {
  nombreAtributo = argv[2];
  valorAtributo = parseInt(argv[3], 10);
}

const atributo: object = {
  [nombreAtributo]: valorAtributo,
};

const testGetMany = modelo.getMany(atributo)
.pipe(tap((result) => console.log('getMany --> ok', result.length)));

export default testGetMany;
