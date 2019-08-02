import {connect as ioconnect, Socket} from 'socket.io-client';

import ISimpleCoin from './simplecoin.interface';

import IResponseSimple from './responsesimple.interface';

import urlServer from './environment';
import IHistory from './history.interface';

const elto = document.getElementById('histbutton');

const getHistorial = () => {
  const divHistory = document.getElementById('history');
  divHistory.textContent = '';
  // al hacer click veremos el historial de
  // precios de los últimos 100 minutos
  fetch(`${urlServer}/api/coins/history`)
  .then((result) => {
    console.log('llamada correcta');
    return result.json();
  })
  .then((historyResult: IResponseSimple[]) => {

    const historyArray = new Array<IHistory>();

    historyResult.forEach((resp) => {
      historyArray.push({
        price: resp.data[0].price,
        timestamp: resp.status.timestamp,
      });
    });

    historyArray.forEach((his) => {
      divHistory.textContent += `time: ${his.timestamp}  price: ${his.price}\n`;
    });

    // console.log('historyArray: ', historyArray);

    // console.log('obteniendo el historial', historyResult);
    // divHistory.textContent = historyArray;
  });

};
elto.onclick = getHistorial;

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
