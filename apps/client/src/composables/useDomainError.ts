import { useI18n } from 'vue-i18n';
import type { ApiErrorResponse, DomainErrorCode } from '@memoro/shared';
import { DEFAULT_ERROR_KEY, DOMAIN_ERROR_KEYS } from '@/constants/domain-errors';

export function useDomainError() {
  const { t } = useI18n();

  function translateDomainError(code: DomainErrorCode): string {
    const key = DOMAIN_ERROR_KEYS[code];
    return key ? t(key) : t(DEFAULT_ERROR_KEY);
  }

  function translateApiError(error: ApiErrorResponse): string {
    const key = DOMAIN_ERROR_KEYS[error.code as DomainErrorCode];
    if (key) {
      return t(key);
    }
    return error.message.length > 0 ? error.message : t(DEFAULT_ERROR_KEY);
  }

  return {
    translateDomainError,
    translateApiError,
  };
}
