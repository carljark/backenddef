import axios from 'axios';

const getCoinValue = () => {
    axios.get('https://coinmarketcap.com/es/api/')
    .then((respuesta) => {
        console.log('respuesta desde getCoinValue');
        console.log(respuesta);
    })
    .catch((error) => {
        console.log('error: ', error);
    });

};

export default getCoinValue;
