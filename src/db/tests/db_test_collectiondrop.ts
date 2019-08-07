// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import db from '../db';

let col = 'responses';
if (argv.length > 2) {
  col = argv[2];
}

console.log('nombre de la coleccion a consultar: ', col);

db.delCollection(col)
.subscribe((ok) => {
  console.log('collection droped: ', ok);
});
