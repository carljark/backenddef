import { Subject } from 'rxjs';
const changeWidth$ = new Subject<string>();

const detectWidth = (mediaQList: MediaQueryListEvent): any => {
    if (mediaQList.matches) {
        console.log(mediaQList);
        changeWidth$.next(mediaQList.media);

    }
};

const mQList1024 = window.matchMedia('(max-width: 1024px)');
const mQList568 = window.matchMedia('(max-width: 568px)');
const mQList320 = window.matchMedia('(max-width: 320px)');
const mQList321 = window.matchMedia('(min-width: 321px)');

mQList1024.addListener(detectWidth);
mQList568.addListener(detectWidth);
mQList320.addListener(detectWidth);
mQList321.addListener(detectWidth);

export default changeWidth$;
