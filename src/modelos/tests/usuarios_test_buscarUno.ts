import modelo from '../usuarios';
import {argv} from 'process';
let nombreAtributo = 'nombre';
let valorAtributo = 'carlos';

if (argv.length > 3) {
  nombreAtributo = argv[2];
  valorAtributo = argv[3];
}
const atributo = {
  [nombreAtributo]: valorAtributo
}
console.log('atributo y valor buscado: ', atributo);
modelo.buscarUno(atributo)
.subscribe(result => {
  // console.log('result: \n', result);
  console.log('buscarUno --> ok', result);
})
