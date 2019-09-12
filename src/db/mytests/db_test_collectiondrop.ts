// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import {switchMap} from 'rxjs/operators';
import db from '../db';

let col = 'prueba';
if (argv.length > 2) {
  col = argv[2];
}

console.log('nombre de la coleccion a consultar: ', col);

db.delCollection(col)
.subscribe((dbresult) => {
  console.log('collection droped: ', dbresult.result);
  dbresult.cli.close();
});
