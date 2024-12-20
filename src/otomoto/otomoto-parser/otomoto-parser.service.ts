import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { createHash } from 'crypto';
import { IArticle, OtomotoSelectors } from './otomoto-parser.interfaces';

@Injectable()
export class OtomotoParserService {
  private static buildDescription(description: string): string {
    return description?.length > 100 ? 'n/a' : description;
  }

  private parseArticle(article: any): IArticle {
    const link = article.querySelector(OtomotoSelectors.Link)?.attributes?.href
      ?.textContent;

    // eslint-disable-next-line no-unsafe-optional-chaining
    const [engine = 'n/a', power = 'n/a', description = 'n/a'] =
      article
        .querySelector(OtomotoSelectors.Description)
        ?.textContent?.split(' • ') || [];

    return {
      // id: article.id, //todo: article.id some times have been changing for any ads
      id: createHash('md5').update(link).digest('hex'),
      link,
      title: article.querySelector(OtomotoSelectors.Title)?.textContent,
      description,
      year: article.querySelector(OtomotoSelectors.Year)?.textContent,
      mileage: article.querySelector(OtomotoSelectors.Mileage)?.textContent,
      engine,
      power,
      gearbox: article.querySelector(OtomotoSelectors.GearBox)?.textContent,
      fuelType: article.querySelector(OtomotoSelectors.FuelType)?.textContent,
      location: article.querySelector(OtomotoSelectors.Location)?.textContent,
      // @ts-ignore
      img: article.querySelector(OtomotoSelectors.Img)?.attributes?.src
        ?.textContent,
      price: article.querySelector(OtomotoSelectors.Price)?.textContent,
    };
  }

  parse(htmlPage: string, limit = 1000): IArticle[] {
    const doc = new JSDOM(htmlPage).window.document;

    const nodeArticles = Array.from(
      doc.querySelectorAll(OtomotoSelectors.Articles),
    ).slice(0, limit);

    return nodeArticles.map(this.parseArticle);
  }
}
