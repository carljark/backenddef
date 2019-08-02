import {connect as ioconnect, Socket} from 'socket.io-client';

import urlServer from './environment';

const elto = document.getElementById('historial');

const ejecutar = () => {
  // al hacer click veremos el historial de
  // precios de los últimos 100 minutos
};
elto.onclick = ejecutar;

fetch(`${urlServer}/api/coins`)
  .then((result) => {
    return result.json();
  })
  .then((myjson) => {
    console.log(myjson);
    const divData = document.getElementById('data');

    for (let i = 0; i < 2; i++) {
      const eltoDiv = document.createElement('div');
      eltoDiv.className = 'fila';
      const eltoDataName = document.createElement('p');
      const eltoDataPrice = document.createElement('p');
      eltoDataName.textContent = myjson[i].name;
      eltoDataPrice.textContent = myjson[i].price;
      eltoDiv.appendChild(eltoDataName);
      eltoDiv.appendChild(eltoDataPrice);
      divData.appendChild(eltoDiv);
    }

    // después de la primera llamada vamos a conectarnos
    // con el socket del servidor
    const iosocket = ioconnect(urlServer);
  });
