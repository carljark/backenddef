import {connect as ioconnect } from 'socket.io-client';

import ISimpleCoin from './simplecoin.interface';

import urlServer from './environment';

import ICoinHistory from './coin-history.interface';

import '../styles.scss';

// const elto = document.getElementById('histbutton');
const selectElto = document.getElementById('coinname') as HTMLSelectElement;
// const divHistory = document.getElementById('history');

const getHistorial = () => {
  // lazy load d3historygraph
  import(/* webpackChunkName: "d3historygraph" */ './d3historygraph').then((module) => {
    const coinName = selectElto.value; // selectedindex
    console.log('select: ', coinName);
    // al hacer click veremos el historial de
    // precios de los últimos 100 minutos
    fetch(`${urlServer}/api/coins/history/${coinName}`)
    .then((result) => {
      console.log('llamada correcta');
      return result.json();
    })
    .then((coinHistory: ICoinHistory) => {
      // desactivo la actualización del historial en el textarea
      /* divHistory.textContent = '';
      coinHistory.timePriceArray.forEach((his: ITimePrice) => {
        divHistory.textContent += `time: ${his.timestamp}  price: ${his.price}\n`;
      }); */
      const d3Graph = new module.GraphLineComponent([coinHistory]);
    });
  });

};
// elto.onclick = getHistorial;
selectElto.onchange = getHistorial;

const elementNameArray = new Array<HTMLParagraphElement>();
const elementPriceArray = new Array<HTMLParagraphElement>();
const selectEltoArray = new Array<HTMLOptionElement>();

const coinsCount = 10;

for (let i = 0; i < coinsCount; i++) {
  elementNameArray.push(document.createElement('p'));
  elementPriceArray.push(document.createElement('p'));
  selectEltoArray.push(document.createElement('option'));
}

fetch(`${urlServer}/api/coins`)
  .then((result) => {
    return result.json();
  })
  .then((myjson: ISimpleCoin[]) => {
    console.log(myjson);
    const divData = document.getElementById('data');

    for (let i = 0; i < coinsCount; i++) {
      const eltoDiv = document.createElement('div');
      eltoDiv.className = 'fila';
      elementNameArray[i].textContent = myjson[i].name;
      elementPriceArray[i].textContent = myjson[i].price.toString();
      eltoDiv.appendChild(elementNameArray[i]);
      eltoDiv.appendChild(elementPriceArray[i]);
      divData.appendChild(eltoDiv);

      selectEltoArray[i].text = myjson[i].name;
      selectEltoArray[i].value = myjson[i].name;
      selectElto.options.add(selectEltoArray[i]);
    }

    // después de la primera llamada vamos a conectarnos
    // con el socket del servidor
    const iosocket = ioconnect(urlServer);
    iosocket.on('coin update', (emision: ISimpleCoin[]) => {
      emision.forEach((coin, index) => {
        elementNameArray[index].textContent = coin.name;
        // console.log('coin.price: ', coin.price);
        elementPriceArray[index].textContent = coin.price.toString();
      });
      // console.log('emision: ', emision);
    });
    // elto.click();
    getHistorial();
  });
