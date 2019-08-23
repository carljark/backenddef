import {connect as ioconnect } from 'socket.io-client';

import ISimpleCoin from './simplecoin.interface';

import config from './environment';

import ICoinHistory from './coin-history.interface';

import '../styles.scss';

// const elto = document.getElementById('histbutton');
// const selectElto = document.getElementById('coinname') as HTMLSelectElement;
// const divHistory = document.getElementById('history');

// si la función se ejecuta desde un eltodiv.onclick
// puede que le pase el eltodiv como argumento
// comprobar
const getHistorial = (clickEvent: MouseEvent) => {
  const elementTarget: HTMLDivElement = clickEvent.target as HTMLDivElement;
  // se trata de añadir la clase a la capa creada mas abajo como eltodiv
  import(/* webpackChunkName: "d3historygraph" */ './d3historygraph').then((module) => {
    const pChild: HTMLParagraphElement = elementTarget.firstChild as HTMLParagraphElement;
    if (elementTarget.className === 'fila coinselected') {
      elementTarget.className = 'fila';
      // elimino el gráfico que corresponde con la coin cliqueada
      module.GraphLineComponent.removeSvg$(pChild.innerText);
    } else {
      elementTarget.className = 'fila coinselected';
      console.log('coin name: ', pChild.innerText);
      // lazy load d3historygraph
      // const coinName = selectElto.value; // selectedindex
      const coinName = pChild.innerText;
      console.log('select: ', coinName);
      // al hacer click veremos el historial de
      // precios de los últimos 100 minutos
      fetch(`${config.urlServer}/api/coins/history/${coinName}`)
      .then((result) => {
        return result.json()
        .catch((reason) => {
          console.log('reason: ', reason);
          return undefined;
        });
      })
      .then((coinHistory: ICoinHistory) => {
        // desactivo la actualización del historial en el textarea
        /* divHistory.textContent = '';
        coinHistory.timePriceArray.forEach((his: ITimePrice) => {
          divHistory.textContent += `time: ${his.timestamp}  price: ${his.price}\n`;
        }); */
        if (coinHistory) {
          const d3Graph = new module.GraphLineComponent([coinHistory]);
        }
      });
    }
  });
};
// elto.onclick = getHistorial;
// selectElto.onchange = getHistorial;

const elementNameArray = new Array<HTMLParagraphElement>();
const elementPriceArray = new Array<HTMLParagraphElement>();
// const selectEltoArray = new Array<HTMLOptionElement>();

const coinsCount = 10;

// creo los párrafos y las options para cada coin
// y les asigno clases para desactivar sus eventos de click
for (let i = 0; i < coinsCount; i++) {
  const pName = document.createElement('p');
  pName.className = 'pname';
  elementNameArray.push(pName);
  const pPrice = document.createElement('p');
  pPrice.className = 'pprice';
  elementPriceArray.push(pPrice);
  // selectEltoArray.push(document.createElement('option'));
}

fetch(`${config.urlServer}/api/coins`)
  .then((result) => {
    return result.json();
  })
  .then((myjson: ISimpleCoin[]) => {
    console.log(myjson);
    const divData = document.getElementById('data');

    // creo las div para cada coin si las hay
    if (myjson.length) {
      for (let i = 0; i < coinsCount; i++) {
        const eltoDiv = document.createElement('div');
        eltoDiv.className = 'fila';
        const name = myjson[i].name + 'data';
        eltoDiv.id = name;
        elementNameArray[i].textContent = myjson[i].name;
        elementPriceArray[i].textContent = myjson[i].price.toString();
        eltoDiv.appendChild(elementNameArray[i]);
        eltoDiv.appendChild(elementPriceArray[i]);

        // meter en getHistorial el nombre de la coin
        // que está en el primer hijo tipo 'p'
        eltoDiv.onclick = getHistorial;

        divData.appendChild(eltoDiv);

        /* selectEltoArray[i].text = myjson[i].name;
        selectEltoArray[i].value = myjson[i].name;
        selectElto.options.add(selectEltoArray[i]); */
        if (i === 0) {
          console.log('click on eltodiv');
          eltoDiv.click();
        }
      }

      // después de la primera llamada vamos a conectarnos
      // con el socket del servidor
      const iosocket = ioconnect(config.urlServer);
      iosocket.on('coin update', (emision: ISimpleCoin[]) => {
        emision.forEach((coin, index) => {
          elementNameArray[index].textContent = coin.name;
          // console.log('coin.price: ', coin.price);
          elementPriceArray[index].textContent = coin.price.toString();
        });
        // console.log('emision: ', emision);
      });
      // elto.click();
      // getHistorial();

    }
  });
