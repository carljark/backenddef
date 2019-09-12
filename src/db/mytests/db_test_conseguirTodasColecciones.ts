// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import {switchMap} from 'rxjs/operators';
import db from '../db';

let col: string = 'prueba';
if (argv.length > 2) {
  col = argv[2];
}

db.getAllCollections()
.subscribe((clidbresult) => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  const yo = clidbresult.collections.map((elto, index, array) => elto.name);
  console.log('conseguirTodasColecciones --> ok \n', yo);
  clidbresult.cli.close();
});
