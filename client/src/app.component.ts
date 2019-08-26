import { Observable, of, Subscription } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';

import ISimpleCoin from './simplecoin.interface';

import config from './environment';

import ICoinHistory from './coin-history.interface';

import { GetCurrenciesService } from './get-currencies.service';
import { SocketioService } from './socketio.service';

import update from './update-currencies.function';

export class AppComponent {
    public eltoDivs: HTMLDivElement[] = new Array<HTMLDivElement>();
    public coinsCount = 10;
    public lastCurrs: ISimpleCoin[];
    public currencyNameArray = new Array<HTMLParagraphElement>();
    public currencyPriceArray = new Array<HTMLParagraphElement>();
    // escribir los arrays en el servicio socketio.service y
    // eliminarlos de los argumentos
    public divData = document.getElementById('data');

  constructor(
      private getCurrServ: GetCurrenciesService,
      private socketioServ: SocketioService,
      ) {

    // creo los párrafos y las options para cada coin
    // y les asigno clases para desactivar sus eventos de click
    this.getCurrServ.getLastCurrencies()
    .pipe(
        switchMap((lastCurrs) => {
            this.lastCurrs = lastCurrs;
            console.log('lastCurrs: ', lastCurrs);
            return this.createParagraphs();
        }),
        switchMap(() => this.createTable()),
        // crear un miembro de array de eltoDiv
        // para poder acceder directamente al primero
        // y ejecutar su click
    )
    .subscribe((ok) => {
        this.clockOnFirstCurrencyFile();
        this.socketioServ.start().subscribe();
        this.socketioServ.getUpdatedCurrencies$()
        .subscribe((c) => {
          this.lastCurrs = c;
          console.log('updated coins: ', c);
          update(c, this.currencyNameArray, this.currencyPriceArray);
        });
    });
  }
  public clockOnFirstCurrencyFile() {
      this.eltoDivs[0].click();
  }
  public createParagraphs() {
      return of(this.lastCurrs)
      .pipe(
          tap(() => {
              // crear una clase o interfaz para
              // emparejar los dos párrafos de cada
              // currency
              this.lastCurrs.forEach(() => {
                const pName = document.createElement('p');
                pName.className = 'pname';
                this.currencyNameArray.push(pName);
                const pPrice = document.createElement('p');
                pPrice.className = 'pprice';
                this.currencyPriceArray.push(pPrice);
            });
          }),
          mapTo(true),
      );
  }

  public createTable(): Observable<boolean> {
      return of(this.lastCurrs)
      .pipe(
          tap((lastCurr) => {
              console.log('htmlPelements: ', lastCurr);
              this.lastCurrs.forEach((coin, i) => {
                const eltoDiv = document.createElement('div');
                eltoDiv.className = 'fila';
                const name = this.lastCurrs[i].name + 'data';
                eltoDiv.id = name;
                this.currencyNameArray[i].textContent = this.lastCurrs[i].name;
                this.currencyPriceArray[i].textContent = this.lastCurrs[i].price
                  .toLocaleString('es-ES', {
                    currency: 'EUR',
                    style: 'currency',
                  })
                  .toString();
                eltoDiv.appendChild(this.currencyNameArray[i]);
                eltoDiv.appendChild(this.currencyPriceArray[i]);

                eltoDiv.onclick = this.getHistorial.bind(this);
                // eltoDiv.onclick = this.getHistorial.bind(this);

                this.divData.appendChild(eltoDiv);

                this.eltoDivs.push(eltoDiv);

                /* if (i === 0) {
                  eltoDiv.click();
                } */
              });
          }),
          mapTo(true),
      );
  }

  public getHistorial(clickEvent: MouseEvent) {
          console.log('no se subscribe');
          const elementTarget: HTMLDivElement = clickEvent.target as HTMLDivElement;
          // se trata de añadir la clase a la capa creada mas abajo como eltodiv
          import(/* webpackChunkName: "d3historygraph" */ './d3historygraph').then(
            (module) => {
              const pChild: HTMLParagraphElement = elementTarget.firstChild as HTMLParagraphElement;
              if (elementTarget.className === 'fila coinselected') {
                elementTarget.className = 'fila';
                module.GraphLineComponent.removeSvg$(pChild.innerText);
              } else {
                elementTarget.className = 'fila coinselected';
                const coinName = pChild.innerText;
                fetch(`${config.urlServer}/api/coins/history/${coinName}`)
                  .then((result) => {
                    return result.json().catch((reason) => {
                      console.log('reason: ', reason);
                      return undefined;
                    });
                  })
                  .then((coinHistory: ICoinHistory) => {
                    if (coinHistory) {
                      const d3Graph = new module.GraphLineComponent([coinHistory], this.socketioServ);
                    }
                  });
              }
            },
          );
  }
}
