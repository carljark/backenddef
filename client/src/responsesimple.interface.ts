import ISimpleCoin from './simplecoin.interface';

export default interface IResponseSimple {
  status: {
    timestamp: Date;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: ISimpleCoin[];
}
