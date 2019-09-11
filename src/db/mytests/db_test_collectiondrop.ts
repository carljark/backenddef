// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import {switchMap} from 'rxjs/operators';
import dbInterf from '../db';
import db$ from '../db.factory';

let col = 'responses';
if (argv.length > 2) {
  col = argv[2];
}

console.log('nombre de la coleccion a consultar: ', col);

db$
.pipe(
	switchMap((db) => dbInterf.delCollection(db, col)),
	)
.subscribe((ok) => {
  console.log('collection droped: ', ok);
});
