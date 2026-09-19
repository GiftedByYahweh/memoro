<script setup lang="ts">
import { ref, watch } from 'vue';
import { PinInputRoot, PinInputInput } from 'reka-ui';
import { AUTH_CONSTRAINTS } from '@memoro/shared';

interface Props {
  modelValue?: string;
  length?: number;
  error?: string;
  disabled?: boolean;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  length: AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH,
  error: undefined,
  disabled: false,
  autofocus: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  complete: [value: string];
}>();

const pinValues = ref<number[]>(props.modelValue ? props.modelValue.split('').map(Number) : []);

watch(
  () => props.modelValue,
  (newValue) => {
    const nextArr = newValue ? newValue.split('').map(Number) : [];
    if (nextArr.join('') !== pinValues.value.join('')) {
      pinValues.value = nextArr;
    }
  },
);

watch(
  pinValues,
  (newValues) => {
    const joined = newValues.join('');
    if (joined !== props.modelValue) {
      emit('update:modelValue', joined);
    }
  },
  { deep: true },
);

function handleComplete(values: number[]): void {
  emit('complete', values.join(''));
}
</script>

<template>
  <div class="pin-container">
    <PinInputRoot
      v-model="pinValues"
      :disabled="disabled"
      otp
      type="number"
      class="pin-root"
      @complete="handleComplete"
    >
      <PinInputInput
        v-for="index in length"
        :key="index - 1"
        :index="index - 1"
        :class="['pin-slot', { 'has-error': Boolean(error) }]"
        :autofocus="autofocus && index === 1"
      />
    </PinInputRoot>
    <p v-if="error" class="pin-error" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.pin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
}

.pin-root {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  width: 100%;
  max-width: 360px;
}

.pin-slot {
  flex: 1;
  min-width: 0;
  max-width: 52px;
  height: 56px;
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  font-family: var(--font-mono, monospace);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
  caret-color: var(--color-primary);
  color-scheme: dark;
}

.pin-slot:hover {
  border-color: var(--border-hover);
}

.pin-slot:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--border-focus-primary);
}

.pin-slot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--border-subtle);
}

.pin-slot.has-error {
  border-color: var(--color-danger);
}

.pin-slot.has-error:focus {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px var(--border-focus-danger);
}

.pin-error {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: var(--color-danger);
  text-align: center;
}
</style>
