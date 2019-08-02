import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

export interface IresponseSimpleDataCoin {
    status: {
      timestamp: Date;
      error_code: number;
      error_message: string|null;
      elapsed: number;
      credit_count: number;
    };
    data: ISimpleCoin[];
  }
