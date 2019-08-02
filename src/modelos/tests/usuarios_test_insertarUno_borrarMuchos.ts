import {argv} from 'process';
import usuarios from '../usuarios';
// console.log('vamos a insertar un documento {nombre: \'carlos\' en la coleccion usuarios:')
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

usuarios.insertarUno(userDoc)
.subscribe(resinsert => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  console.log('insertarUno_borrarMuchos --> insertarUno: ok', resinsert.result);
  usuarios.borrarMuchos(userDoc)
  .subscribe(resborrar => {
    // console.log('objeto DeleteWriteOpResultObject.result: \n', result.result);
    // console.log('insertarUno_borrarMuchos: ok');
    console.log('insertarUno_borrarMuchos --> borrarMuchos: ok', resborrar.result);
  });
})

