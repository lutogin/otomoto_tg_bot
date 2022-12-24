const OTOMOTO_LINK_EXAMPLE =
  'https://www.otomoto.pl/osobowe/mercedes-benz/od-2017/wroclaw?search%5Bdist%5D=50&search%5Badvanced_search_expanded%5D=true';

export const MessagesMap = {
  Start: {
    en: '👇 Please, select a menu item.',
    pl: '👇 Proszę wybrać pozycję z menu.',
    ua: '👇 Будь ласка, оберіть пункт меню.',
  },
  Menu: {
    Setup: {
      en: '⚙️ Set search url.',
      pl: '⚙️ Ustaw adres url wyszukiwania.',
      ua: '⚙️ Встановити URL для пошуку.',
    },
    Stop: {
      en: '🛑 Stop receiving messages.',
      pl: '🛑 Przestań odbierać wiadomości.',
      ua: '🛑 Припинити отримувати повідомлення.',
    },
  },
  OfferToSetUrl: {
    en: `🔗 Please, send me the search link from otomoto.pl \nExample: ${OTOMOTO_LINK_EXAMPLE}`,
    pl: `🔗 Proszę o przesłanie linku do wyszukiwania z otomoto.pl \nPrzykład: ${OTOMOTO_LINK_EXAMPLE}`,
    ua: `🔗 Будь ласка, надішліть мені посилання на пошук з otomoto.pl \nПриклад: ${OTOMOTO_LINK_EXAMPLE}`,
  },
  Help: {
    en: '🎬 Use /start command for start the bot.',
    pl: '🎬 Użyj komendy /start, aby uruchomić bota.',
    ua: '🎬 Для запуску бота використовуйте команду /start',
  },
  NotSupported: {
    en: '😔 Sorry, not supported command.',
    pl: '😔 Przepraszamy, polecenie nieobsługiwane.',
    ua: '😔 Вибачте, команда не підтримується.',
  },
  Stop: {
    en: '✋ I stopped watching for new ads.',
    pl: '✋ Zatrzymałem się, by obserwować nowe ogłoszenia.',
    ua: '✋ Я перестав стежити за новими оголошеннями.',
  },
  StartLooking: {
    en: '🔍 Ok. I will be watching it for you. For set new search url, just send it to me.',
    pl: '🔍 Ok. Będę to obserwował dla ciebie. Aby ustawić nowy adres url wyszukiwania, po prostu wyślij go do mnie.',
    ua: '🔍️ Гаразд, я буду стежити за цим для вас. Щоб встановити новий URL для пошуку, просто надішліть його мені.',
  },
  StartLookingUpdatedUrl: {
    en: '👌 Your url has been updated. I will be watching it for you.',
    pl: '👌 Twój url został zaktualizowany. Będę to obserwował dla ciebie.',
    ua: '👌 Ваше url оновлено. Я буду стежити за ним для вас.',
  },
  LastArticles: {
    en: '📰 Here is last 5 articles from you url.',
    pl: '📰 Oto ostatnie 5 artykułów z Twojego adresu url.',
    ua: '📰 Ось останні 5 статей з вашого url',
  },
  Wait: {
    en: '🕒 Please wait. Getting a data and setting your url.',
    pl: '🕒 Proszę czekać. Pobierz dane i ustaw swój url.',
    ua: '🕒 Будь ласка, зачекайте. Отримання даних та налаштування вашого звязку.',
  },
};
