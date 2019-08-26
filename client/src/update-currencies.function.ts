import { Observable, of } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';
import ISimpleCoin from './simplecoin.interface';

const updateCurrencies = (
  emision: ISimpleCoin[],
  currencyNameArray: HTMLParagraphElement[],
  elementPriceArray: HTMLParagraphElement[],
) => {
  emision.forEach((coin, index) => {
        currencyNameArray[index].textContent = coin.name;
        elementPriceArray[index].textContent = coin.price
          .toLocaleString('es-ES', {
            currency: 'EUR',
            style: 'currency',
          })
          .toString();
      });

};
export default updateCurrencies;
