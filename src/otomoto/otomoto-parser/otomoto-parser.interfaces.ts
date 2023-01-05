export enum OtomotoSelectors {
  Articles = 'main article[data-variant="regular"][data-testid="listing-ad"]',
  Link = 'div h2 a',
  Title = 'div h2 a',
  Description = 'div div p',
  Year = 'div div ul li',
  Mileage = 'div div ul li~li',
  Engine = 'div div ul li~li~li',
  FuelType = 'div div ul li~li~li~li',
  Location = 'div div~ul li span span',
  Date = 'div div~ul li~li',
  Img = 'div~div~div img',
  Price = 'div~div~div > div span',
}

export interface IArticle {
  id: string;
  link: string;
  title: string;
  engine: string;
  img: string;
  price: string;
  year: string;
  mileage: string;
  fuelType: string;
  location?: string;
  description?: string;
  date?: string;
}
