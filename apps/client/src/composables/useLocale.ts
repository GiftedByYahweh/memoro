import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export type AvailableLocale = 'uk' | 'en';

export function useLocale() {
  const { locale, t } = useI18n();

  const currentLocale = computed(() => locale.value as AvailableLocale);

  function setLocale(newLocale: AvailableLocale): void {
    locale.value = newLocale;
    document.documentElement.lang = newLocale;
  }

  function toggleLocale(): void {
    const nextLocale: AvailableLocale = currentLocale.value === 'uk' ? 'en' : 'uk';
    setLocale(nextLocale);
  }

  return {
    currentLocale,
    setLocale,
    toggleLocale,
    t,
  };
}
