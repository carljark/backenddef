import { fromEvent, Observable, of } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';

import ISimpleCoin from './simplecoin.interface';

import config from './environment';

import ICoinHistory from './coin-history.interface';

import { GetCurrenciesService } from './get-currencies.service';
import { SocketioService } from './socketio.service';

import update from './update-currencies.function';

export class AppComponent {
    public clickEvent$ = new Observable<Event>();
    public coinstCount = 0;
    public graficos: any;
    public eltoDivs: HTMLDivElement[] = new Array<HTMLDivElement>();
    public coinsCount = 10;
    public lastCurrs: ISimpleCoin[];
    public currencyNames: string[] = new Array<string>();
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
            this.coinstCount = lastCurrs.length;
            return this.createParagraphs();
        }),
        switchMap(() => this.createTable()),
        // crear un miembro de array de eltoDiv
        // para poder acceder directamente al primero
        // y ejecutar su click
    )
    .subscribe((ok) => {
        this.clickOnFirstCurrencyFile();
        this.socketioServ.start().subscribe();
        this.socketioServ.getUpdatedCurrencies$()
        .subscribe((c) => {
          this.lastCurrs = c;
          update(c, this.currencyNameArray, this.currencyPriceArray);
        });
    });

    this.clickEvent$ = fromEvent(this.divData, 'click');
    this.clickEvent$
    .pipe(switchMap((event) => this.getHistorial(event as MouseEvent)))
    .subscribe();
  }
  public clickOnFirstCurrencyFile() {
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
              this.lastCurrs.forEach((coin, i) => {
                this.currencyNames.push(coin.name);
                const eltoDiv = document.createElement('div');
                eltoDiv.className = 'fila';
                const name = coin.name + 'data';
                eltoDiv.id = name;
                this.currencyNameArray[i].textContent = coin.name;
                this.currencyPriceArray[i].textContent = coin.price
                  .toLocaleString('es-ES', {
                    currency: 'EUR',
                    style: 'currency',
                  })
                  .toString();
                eltoDiv.appendChild(this.currencyNameArray[i]);
                eltoDiv.appendChild(this.currencyPriceArray[i]);

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

  public getHistorial(clickEvent: MouseEvent): Observable<boolean> {
    return new Observable<boolean>((ob) => {
      const elementTarget: HTMLDivElement = clickEvent.target as HTMLDivElement;
      // se trata de añadir la clase a la capa creada mas abajo como eltodiv
      import(/* webpackChunkName: "d3historygraph" */ './d3historygraph').then(
        (module) => {

          const pChild: HTMLParagraphElement = elementTarget.firstChild as HTMLParagraphElement;
          const coinName = pChild.innerText;
          const indexCoin = this.currencyNames.findIndex((curr) => curr === coinName);
          if (elementTarget.className === 'fila coinselected') {
            // debo conseguir el índice de la fila
            elementTarget.className = 'fila';
            // debo conseguir eliminar las subscripciones
            // accediendo a la instancia currespondiente del gráfico
            // voy a guardar las instancias en una matriz de instancias
            // averiguo el indice de la coinname para usarlo en
            // el array del gráfico y unsubscribe en la instancia correspondiente
            // esto está cojido con pinzas
            this.graficos[indexCoin].onclickremove();
            module.GraphLineComponent.removeSvg$(pChild.innerText);
          } else {
            elementTarget.className = 'fila coinselected';
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
                  if (!this.graficos) {
                    this.graficos = new Array(this.coinstCount);
                  }
                  this.graficos[indexCoin] = d3Graph;
                }
              });
          }
          ob.next(true);
        },
      );
    });
  }
}
