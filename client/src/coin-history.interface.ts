export interface ITimePrice {
    timestamp: Date;
    price: number;
}

export interface ICoinHistory {
    name: string;
    timePriceArray: ITimePrice[];
}
