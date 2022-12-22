const OTOMOTO_LINK_EXAMPLE =
  'https://www.otomoto.pl/osobowe/mercedes-benz/od-2017/wroclaw?search%5Bdist%5D=50&search%5Badvanced_search_expanded%5D=true';

export const MessagesMap = {
  Start: {
    en: 'Please, select a menu item',
    pl: 'Proszę wybrać pozycję z menu',
  },
  Menu: {
    Setup: {
      en: '🔍 Set search url',
      pl: '🔍 Ustaw adres url wyszukiwania',
    },
    Stop: {
      en: '🛑 Stop receiving messages',
      pl: '🛑 Przestań odbierać wiadomości',
    },
  },
  OfferToSetUrl: {
    en: `Please, send me the search link from otomoto.pl Example: ${OTOMOTO_LINK_EXAMPLE}`,
    pl: `Proszę o przesłanie linku do wyszukiwania z otomoto.pl Przykład.: ${OTOMOTO_LINK_EXAMPLE}`,
  },
  Help: {
    en: 'Use /start command for start the bot',
    pl: 'Użyj komendy /start, aby uruchomić bota',
  },
  NotSupported: {
    en: 'Sorry, not supported command',
    pl: 'Przepraszamy, polecenie nieobsługiwane',
  },
  Stop: {
    en: 'I stopped watching for new ads',
    pl: 'Zatrzymałem się, by obserwować nowe ogłoszenia',
  },
  StartLooking: {
    en: 'Ok. I will be watching it for you. For set new search url, just send it to me',
    pl: 'Ok. Będę to obserwował dla ciebie. Aby ustawić nowy adres url wyszukiwania, po prostu wyślij go do mnie',
  },
  StartLookingUpdatedUrl: {
    en: 'Your link has been updated. I will be watching it for you',
    pl: 'Twój link został zaktualizowany. Będę to obserwował dla ciebie',
  },
};
