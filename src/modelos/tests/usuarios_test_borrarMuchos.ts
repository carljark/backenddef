import usuarios from '../usuarios';
import {argv} from 'process';

let nombreAtributo = 'mail';
let valorAtributo = 'carlosag31@hotmail.com';
if (argv.length > 3) {
  nombreAtributo = argv[2];
  valorAtributo = argv[3];
}
const atributo = {
  [nombreAtributo]: valorAtributo
}
console.log('atributo preparado para borrar: ', atributo);
usuarios.borrarMuchos(atributo)
.subscribe(resborrar => {
  // console.log('objeto DeleteWriteOpResultObject.result: \n', result.result);
  // console.log('insertarUno_borrarMuchos: ok');
  console.log('borrarMuchos --> ok', resborrar.result);
});

