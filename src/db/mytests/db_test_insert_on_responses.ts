// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import db from '../db';

import {IResp} from '../../interfaces/response-simplified.interface';

let coleccion = 'responses';
let idInput = 0;
let nameInput = 'bitcoin';
let priceInput = 10000;
const idInput2 = 1;
const nameInput2 = 'ethereum';
const priceInput2 = 2000;

if (argv.length > 5) {
  coleccion = argv[2];
  idInput = parseInt(argv[3], 10);
  nameInput = argv[4];
  priceInput = parseInt(argv[5], 10);
} else if (argv.length > 4) {
  idInput = parseInt(argv[3], 10);
  nameInput = argv[4];
  priceInput = parseInt(argv[5], 10);
}

const crearObjeto = (key: string, value: string) => {
  const objeto = {
    [key] : value,
  };
  objeto[key] = value;
  return objeto;
};

const createCoinsResponseDoc = (): IResp => {
  return {
    data: [
      {
        id: idInput,
        name: nameInput,
        price: priceInput,
      },
      {
        id: idInput2,
        name: nameInput2,
        price: priceInput2,
      },
    ],
    status: {
      credit_count: 12,
      elapsed: 117,
      error_code: 0,
      error_message: null,
      timestamp: new Date(),
    },
  };
};

/* const documento = crearObjeto(clave, valor);
console.log('nombre de la coleccion: ', coleccion);
console.log('documento preparado: ', documento); */

const coinsResponseDoc = createCoinsResponseDoc();

db.insertOne(coleccion, coinsResponseDoc)
.subscribe((result) => {
  console.log('insertado una respuesta con array de coins --> ok', result.result);
  result.cli.close();
});
