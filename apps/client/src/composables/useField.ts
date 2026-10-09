import { reactive, watch } from 'vue';
import type { toValidationIssues } from '@memoro/shared';
import { useValidation } from './useValidation';

type SchemaIssues = Parameters<typeof toValidationIssues>[0];

interface FieldSchema<TOutput> {
  safeParse(
    value: unknown,
  ): { success: true; data: TOutput } | { success: false; error: { issues: SchemaIssues } };
}

export function useField<TOutput>(schema: FieldSchema<TOutput>, initialValue = '') {
  const { translateFirstIssue } = useValidation();

  const field = reactive({
    value: initialValue,
    error: undefined as string | undefined,
    validate(): TOutput | undefined {
      const result = schema.safeParse(field.value);
      field.error = result.success ? undefined : translateFirstIssue(result.error.issues);
      return result.success ? result.data : undefined;
    },
  });

  watch(
    () => field.value,
    () => {
      field.error = undefined;
    },
  );

  return field;
}
