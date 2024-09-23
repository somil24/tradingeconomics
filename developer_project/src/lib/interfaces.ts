export interface Country {
  Country: string;
  Continent: string;
  Group: string;
  ISO3: string;
  ISO2: string;
}

export interface Index {
  Symbol: string;
  Name: string;
  Country: string;
}

export interface TradeData {
  symbol: string;
  country1: string;
  country2: string;
  value: number | null;
  date: number;
  type: "Import" | "Export";
  category: string;
  url: string;
  title: string;
  StartDate: string | null;
  lastupdate: string;
}

export interface CategoryCount {
  [category: string]: {
    import: number;
    export: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  country: string;
  category: string;
  symbol: string;
  url: string;
  importance: number;
}
