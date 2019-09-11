// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import {switchMap} from 'rxjs/operators';
import dbfact$ from '../db.factory';
import db from '../db';

let col = 'responses';
if (argv.length > 2) {
  col = argv[2];
}

console.log('nombre de la coleccion a consultar: ', col);

dbfact$
.pipe(switchMap((dbfact) => db.createIndex(dbfact, col)))
.subscribe((texto) => {
  console.log('createIndex: ', texto);
});
