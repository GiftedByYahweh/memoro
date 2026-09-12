import { useI18n } from 'vue-i18n';
import type { ValidationIssue } from '@memoro/shared';

type Translate = ReturnType<typeof useI18n>['t'];
type IssueTranslator = (issue: ValidationIssue, t: Translate) => string;

const ISSUE_TRANSLATORS: Partial<Record<string, IssueTranslator>> = {
  too_small: (issue, t) => t('validation.tooShort', { min: issue.params?.minimum }),
  too_big: (issue, t) => t('validation.tooLong', { max: issue.params?.maximum }),
  invalid_string: (issue, t) =>
    issue.params?.validation === 'email' ? t('validation.invalidEmail') : t('validation.invalid'),
  invalid_type: (_issue, t) => t('validation.required'),
};

export function useValidation() {
  const { t } = useI18n();

  function translateIssue(issue: ValidationIssue): string {
    const translator = ISSUE_TRANSLATORS[issue.code];
    return translator ? translator(issue, t) : t('validation.invalid');
  }

  return { translateIssue };
}
