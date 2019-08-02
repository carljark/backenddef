interface Iusd {
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  last_updated: Date;
}

interface Iquote {
  USD: Iusd;
}

export interface IresponseDataCoin {
    status: {
      timestamp: Date;
      error_code: number;
      error_message: string|null;
      elapsed: number;
      credit_count: number;
    };
    data: IDataCoin[];
  }

export default interface IDataCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: Date;
  tags: [];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform: any;
  cmc_rank: number;
  last_updated: Date;
  quote: Iquote;
}


