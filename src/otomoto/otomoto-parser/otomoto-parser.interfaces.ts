export enum OtomotoSelectors {
  Article = 'main article',
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
  Price = 'div~div~div~div div span',
}

export interface IArticle {
  id: string;
  link: string;
  title: string;
  description: string;
  year: string;
  mileage: string;
  engine: string;
  fuelType: string;
  location: string;
  date: string;
  img: string;
  price: string;
}
