import { createI18n } from 'vue-i18n';
import en from '../game/data/locales/en.json';
import pt from '../game/data/locales/pt.json';
import es from '../game/data/locales/es.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
    es
  }
});
