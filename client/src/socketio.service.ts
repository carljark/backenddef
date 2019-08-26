import { from, fromEvent, Observable, Subject } from 'rxjs';
import {mapTo, tap} from 'rxjs/operators';
import {connect as ioconnect } from 'socket.io-client';

import ISimpleCoin from './simplecoin.interface';

import config from './environment';

import updateCurrencies from './update-currencies.function';

const iosocket = ioconnect(config.urlServer);

export class SocketioService {
      public currencies$ = new Subject<ISimpleCoin[]>();
      public namesParagraphs$ = new Observable<HTMLParagraphElement[]>();
      public pricesParagraphs$ = new Observable<HTMLParagraphElement[]>();

      public start(): Observable<boolean> {
            return fromEvent<ISimpleCoin[]>(iosocket, 'coin update')
            .pipe(
                  tap((em) => {
                        console.log('em', em);
                        this.updateCurrencies(em);
                  }),
                  mapTo(true),
            );
      }

      public setHtmlParagraph(namesParagraphs: HTMLParagraphElement[], pricesParagraphs: HTMLParagraphElement[]) {
            this.namesParagraphs$ = from([namesParagraphs]);
            this.pricesParagraphs$ = from([pricesParagraphs]);
      }

      public getUpdatedCurrencies$(): Observable<ISimpleCoin[]> {
            return this.currencies$;
      }

      public updateCurrencies(emision: ISimpleCoin[]) {
            this.currencies$.next(emision);
      }

}
