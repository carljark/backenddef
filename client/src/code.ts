import {connect as ioconnect, Socket} from 'socket.io-client';

import ISimpleCoin from './simplecoin.interface';

import urlServer from './environment';

const elto = document.getElementById('historial');

const ejecutar = () => {
  // al hacer click veremos el historial de
  // precios de los últimos 100 minutos
};
elto.onclick = ejecutar;

const elementNameArray = new Array<HTMLParagraphElement>();
const elementPriceArray = new Array<HTMLParagraphElement>();

for (let i = 0; i < 2; i++) {
  elementNameArray.push(document.createElement('p'));
  elementPriceArray.push(document.createElement('p'));
}

fetch(`${urlServer}/api/coins`)
  .then((result) => {
    return result.json();
  })
  .then((myjson: ISimpleCoin[]) => {
    console.log(myjson);
    const divData = document.getElementById('data');

    for (let i = 0; i < 2; i++) {
      const eltoDiv = document.createElement('div');
      eltoDiv.className = 'fila';
      elementNameArray[i].textContent = myjson[i].name;
      elementPriceArray[i].textContent = myjson[i].price.toString();
      eltoDiv.appendChild(elementNameArray[i]);
      eltoDiv.appendChild(elementPriceArray[i]);
      divData.appendChild(eltoDiv);
    }

    // después de la primera llamada vamos a conectarnos
    // con el socket del servidor
    const iosocket = ioconnect(urlServer);
    iosocket.on('coin update', (emision: ISimpleCoin[]) => {
      emision.forEach((coin, index) => {
        elementNameArray[index].textContent = coin.name;
        console.log('coin.price: ', coin.price);
        elementPriceArray[index].textContent = coin.price.toString();
      });
      console.log('emision: ', emision);
    });
  });
