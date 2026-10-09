import { computed, shallowRef, type ShallowRef } from 'vue';

export interface StepProgress {
  current: number;
  total: number;
}

export function useStepFlow<TStep extends string>(steps: readonly [TStep, ...TStep[]]) {
  const currentStep: ShallowRef<TStep> = shallowRef(steps[0]);

  const progress = computed<StepProgress>(() => ({
    current: steps.indexOf(currentStep.value) + 1,
    total: steps.length,
  }));

  function goTo(step: TStep): void {
    currentStep.value = step;
  }

  return { currentStep, progress, goTo };
}
