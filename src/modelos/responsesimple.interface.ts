import ISimpleCoin from '../coinmarketdata/simplecoin.interface';

import {Istatus} from '../coinmarketdata/datacoin.interface';

export interface IResp {
  status: Istatus;
  data: ISimpleCoin[];
}

export interface IRespDb {
  _id: string;
  status: Istatus;
  data: ISimpleCoin[];
}
