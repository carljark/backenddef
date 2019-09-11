import {argv} from 'process';
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

modelo.getMany(atributo)
.subscribe((result) => {
  // console.log('datos buscados: \n', datos);
  console.log('getMany --> ok', result.length);
});
