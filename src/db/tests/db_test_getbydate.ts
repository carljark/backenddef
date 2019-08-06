// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import db from '../db';

let col = 'responses';

if (argv.length > 3) {
  col = argv[2];
}

const attribs = {
  'status.timestamp': { $gt: new Date('2019-08-02T20:21:15.000Z')},
};

/* db.conseguirTodosDocsDeColeccion(col)
.subscribe((result) => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  console.log('conseguirTodos --> ok', result);
}); */

db.getMany(col, attribs)
.subscribe((result) => {
  console.log('result: ', result);
});
