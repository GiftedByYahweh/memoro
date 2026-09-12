import { useI18n } from 'vue-i18n';
import type { ApiErrorResponse, DomainErrorCode } from '@memoro/shared';
import { DEFAULT_ERROR_KEY, DOMAIN_ERROR_KEYS } from '@/constants/domain-errors';

export function useDomainError() {
  const { t } = useI18n();

  function translateDomainError(errorCode: DomainErrorCode | null): string {
    if (errorCode === null) {
      return t(DEFAULT_ERROR_KEY);
    }
    const key = DOMAIN_ERROR_KEYS[errorCode];
    return key ? t(key) : t(DEFAULT_ERROR_KEY);
  }

  function translateApiError(error: ApiErrorResponse): string {
    return translateDomainError(error.errorCode);
  }

  return {
    translateDomainError,
    translateApiError,
  };
}
