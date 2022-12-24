import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { IArticle, OtomotoSelectors } from './otomoto-parser.interfaces';

@Injectable()
export class OtomotoParserService {
  private parseArticle(article: any): IArticle {
    return {
      id: article.id,
      // @ts-ignore
      link: article.querySelector(OtomotoSelectors.Link)?.attributes?.href
        ?.textContent,
      title: article.querySelector(OtomotoSelectors.Title)?.textContent,
      description: article.querySelector(OtomotoSelectors.Description)
        ?.textContent,
      year: article.querySelector(OtomotoSelectors.Year)?.textContent,
      mileage: article.querySelector(OtomotoSelectors.Mileage)?.textContent,
      engine: article.querySelector(OtomotoSelectors.Engine)?.textContent,
      fuelType: article.querySelector(OtomotoSelectors.FuelType)?.textContent,
      location: article.querySelector(OtomotoSelectors.Location)?.textContent,
      date: article.querySelector(OtomotoSelectors.Date)?.textContent,
      // @ts-ignore
      img: article.querySelector(OtomotoSelectors.Img)?.attributes?.src
        ?.textContent,
      price: article.querySelector(OtomotoSelectors.Price)?.textContent,
    };
  }

  parse(htmlPage: string, limit = 1000): IArticle[] {
    const doc = new JSDOM(htmlPage).window.document;

    const nodeArticles = Array.from(
      doc.querySelectorAll(OtomotoSelectors.Article),
    ).slice(0, limit);

    return nodeArticles.map(this.parseArticle);
  }
}
