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
      const eltoData = document.createElement('p');
      eltoData.textContent =
        ' name: ' + myjson[i].name + '  price: ' + myjson[i].price;
      divData.appendChild(eltoData);
    }
  });
