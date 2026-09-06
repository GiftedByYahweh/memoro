import { createI18n } from 'vue-i18n';

import en from '../locales/en.json';
import uk from '../locales/uk.json';

export type MessageSchema = typeof uk;

export const i18n = createI18n<[MessageSchema], 'uk' | 'en'>({
  legacy: false,
  locale: 'uk',
  fallbackLocale: 'en',
  messages: {
    uk,
    en,
  },
});

export default i18n;
