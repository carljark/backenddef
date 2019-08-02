// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import db from '../db';

let col = 'responses';
if (argv.length > 2) {
  col = argv[2];
}

console.log('nombre de la coleccion a consultar: ', col);

/* db.conseguirTodosDocsDeColeccion(col)
.subscribe((result) => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  console.log('conseguirTodos --> ok', result);
}); */

db.getAllDocuments((docs) => {
  console.log('ok');
  console.log('docs: ', docs);
});
