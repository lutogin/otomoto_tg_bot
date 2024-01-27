export enum OtomotoSelectors {
  Articles = 'main div[data-testid="search-results"]>div>article[data-media-size="small"]',
  Link = 'div h1 a',
  Title = 'div h1 a',
  Year = 'div dl dd[data-parameter="year"]',
  Mileage = 'div dl dd[data-parameter="mileage"]',
  Description = 'div h1+p',
  GearBox = 'div dl dd[data-parameter="gearbox"]',
  FuelType = 'div dl dd[data-parameter="fuel_type"]',
  Location = 'div dl~dl dd p',
  Img = 'div img',
  Price = 'div~div~div h3',
}

export interface IArticle {
  id: string;
  link: string;
  title: string;
  engine: string;
  power: string;
  gearbox: string;
  img: string;
  price: string;
  year: string;
  mileage: string;
  fuelType: string;
  location?: string;
  description?: string;
  date?: string;
}
