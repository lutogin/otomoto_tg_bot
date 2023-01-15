import { from, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

// from(this.searchRequests.findAll()).pipe(
//   filter(searchRequests => !!searchRequests),
//   mergeMap(searchRequests => from(searchRequests)),
//   mergeMap(searchRequest =>
//     this.otomotoService.getArticles(searchRequest.url, Number.parseInt(this.configService.get('OTOMOTO_PAGE_SIZE'), 10) || this.defaultPageSize).pipe(
//       map(articles => ({ searchRequest, articles }))
//     )
//   ),
//   filter(({ articles }) => !!articles),
//   map(({ searchRequest, articles }) => {
//     const newArticles = articles.filter(
//       article => !searchRequest.lastSeenArticleIds.includes(article.id)
//     );
//     if (newArticles.length) {
//       this.logger.log(`Found ${newArticles.length} new articles for @${searchRequest.userName}.`);
//     } else {
//       this.logger.log(`No new article for @${searchRequest.userName}.`);
//     }
//     return { searchRequest, newArticles };
//   }),
//   filter(({ newArticles }) => !!newArticles.length),
//   mergeMap(({ searchRequest, newArticles }) =>
//     from(newArticles).pipe(
//       map(article => this.bot.sendArticle(searchRequest.chatId, article))
//     )
//   ),
//   mergeMap(() =>
//     zip(
//       from(searchRequest),
//       this.searchRequests.update(searchRequest.chatId, { lastSeenArticleIds: articles.map(article => article.id) }),
//     )
//   )
// ).subscribe();
