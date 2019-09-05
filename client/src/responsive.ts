import { BehaviorSubject } from 'rxjs';
import getInitMediaString from './getmediastring.function';

const changeWidth$ = new BehaviorSubject<string>(getInitMediaString());

const detectWidth = (mediaQList: MediaQueryListEvent): any => {
    if (mediaQList.matches) {
        console.log(mediaQList);
        changeWidth$.next(mediaQList.media);

    }
};

const mQList1024 = window.matchMedia('(max-width: 1024px)');
const mQList768 = window.matchMedia('(max-width: 768px)');
const mQList568 = window.matchMedia('(max-width: 568px)');
const mQList320 = window.matchMedia('(max-width: 320px)');

const mQList321 = window.matchMedia('(min-width: 321px)');
const mQList569 = window.matchMedia('(min-width: 569px)');
const mQList769 = window.matchMedia('(min-width: 769px)');
const mQList1025 = window.matchMedia('(min-width: 1025px)');

mQList1024.addListener(detectWidth);
mQList768.addListener(detectWidth);
mQList568.addListener(detectWidth);
mQList320.addListener(detectWidth);

mQList321.addListener(detectWidth);
mQList569.addListener(detectWidth);
mQList769.addListener(detectWidth);
mQList1025.addListener(detectWidth);

export default changeWidth$;
