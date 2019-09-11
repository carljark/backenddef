import ISimpleCoin from './simplecoin.interface';

import {Istatus} from './response-coinmarket.interface';

export interface IResp {
  status: Istatus;
  data: ISimpleCoin[];
}

export interface IRespDb {
  _id: string;
  status: Istatus;
  data: ISimpleCoin[];
}
