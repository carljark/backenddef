// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import {CoinDoc} from '../../modelos/coin.class';
import db from '../db';

import {IresponseDataCoin} from '../../modelos/responsesimple.interface';

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

const createCoinDoc = (id: number, name: string, price: number): CoinDoc => {
  return {
    id,
    name,
    price,
  } as CoinDoc;
};

const createCoinsResponseDoc = (): IresponseDataCoin => {
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
      timestamp: new Date('2019-08-01T12:10:29.168Z'),
    },
  };
};

/* const documento = crearObjeto(clave, valor);
console.log('nombre de la coleccion: ', coleccion);
console.log('documento preparado: ', documento); */

const coinDoc = createCoinDoc(idInput, nameInput, priceInput);

const coinsResponseDoc = createCoinsResponseDoc();

db.insertarUnDocumento('prueba', coinDoc)
.subscribe((result) => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  console.log('insertarUno --> ok', result.result);
});

db.insertarUnDocumento(coleccion, coinsResponseDoc)
.subscribe((result) => {
  console.log('insertado una respuesta con array de coins --> ok', result);
});
