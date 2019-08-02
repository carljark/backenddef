import modelo from '../usuarios';
import {argv} from 'process';

let nombreAtributo = 'nombre';
let valorAtributo = 'carlos';

if (argv.length > 3) {
  nombreAtributo = argv[2];
  valorAtributo = argv[3];
}

const atributo: Object = {
  [nombreAtributo]: valorAtributo
}

console.log('atributo buscado: ', atributo);
// modelo.buscarPorAtributos({atributo: valor})
modelo.buscarPorAtributos(atributo)
.subscribe(result => {
  // console.log('datos buscados: \n', datos);
  console.log('buscarPorAtributos --> ok', result);
})

