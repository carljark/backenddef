// soporta insertar los argumentos desde la línea de comandos
import {argv} from 'process';
import {CoinDoc} from '../../interfaces/coin.class';
import db from '../db';

let coleccion = 'prueba';
let idInput = 2;
let nameInput = 'bitcoin';
let priceInput = 10002;

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

const createCoinDoc = (id: number, name: string, price: number): CoinDoc => {
  return {
    id,
    name,
    price,
  } as CoinDoc;
};

/* const documento = crearObjeto(clave, valor);
console.log('nombre de la coleccion: ', coleccion);
console.log('documento preparado: ', documento); */

const coinDoc = createCoinDoc(idInput, nameInput, priceInput);

db.insertOne(coleccion, coinDoc)
.subscribe((result) => {
  // console.log('data.ops devuelto por insertaruno en la instancia: \n', data.ops);
  console.log('insertarUno --> ok', result.result);
});
