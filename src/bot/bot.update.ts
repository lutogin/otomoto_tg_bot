import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
// eslint-disable-next-line import/no-unresolved
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  @Start()
  async start(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply('Please, wait a few days for the release. Bot just in DEV mod');
  }

  @Help()
  async help(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply('Please, wait a few days for the release. Bot just in DEV mod');
  }

  @On('sticker')
  async on(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply('Test hi action');
  }
}
