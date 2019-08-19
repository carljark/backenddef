import ITimePrice from './timeprice.interface';

export default interface ICoinHistory {
    name: string;
    timePriceArray: ITimePrice[];
}
