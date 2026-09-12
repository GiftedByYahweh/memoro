import type { ZodInvalidStringIssue, ZodIssue, ZodTooBigIssue, ZodTooSmallIssue } from 'zod';

export interface ValidationIssue {
  path: string;
  code: string;
  params?: Record<string, unknown>;
}

type ParamExtractor = (issue: ZodIssue) => Record<string, unknown>;

const PARAM_EXTRACTORS: Partial<Record<ZodIssue['code'], ParamExtractor>> = {
  too_small: (issue) => {
    const { minimum, inclusive, type } = issue as ZodTooSmallIssue;
    return { minimum, inclusive, type };
  },
  too_big: (issue) => {
    const { maximum, inclusive, type } = issue as ZodTooBigIssue;
    return { maximum, inclusive, type };
  },
  invalid_string: (issue) => {
    const { validation } = issue as ZodInvalidStringIssue;
    return { validation };
  },
};

function extractParams(issue: ZodIssue): Record<string, unknown> | undefined {
  return PARAM_EXTRACTORS[issue.code]?.(issue);
}

export function toValidationIssues(issues: ZodIssue[]): ValidationIssue[] {
  return issues.map((issue) => {
    const params = extractParams(issue) ?? {};
    return {
      path: issue.path.join('.'),
      code: issue.code,
      params,
    };
  });
}
