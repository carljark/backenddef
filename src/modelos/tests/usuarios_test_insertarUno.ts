// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import modelo from '../usuarios';

class Usuario {
  nombre: string;
  password: string;
  mail: string;
}

let clave = 'nombre';
let valor = 'carlos';
if (argv.length > 3) {
  clave = argv[2];
  valor = argv[3];
}

function crearDocObject(clave: string, valor: string): Object {
  const objeto = {
    [clave] : valor
  }
  return objeto;
}

const userDoc = crearDocObject(clave, valor);
console.log('usuario preparado para insertar: ',userDoc);

modelo.insertarUno(userDoc)
.subscribe(result => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  // console.log('insertarUno --> ok', result.result);
  console.log('insertarUno --> ok: result', result.result);
  console.log('insertarUno --> ok: ops', result.ops);
})

