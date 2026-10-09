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

function handleComplete(values: (number | undefined)[]): void {
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
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: 500;
  text-align: center;
  outline: none;
  caret-color: var(--color-primary);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.pin-slot:hover {
  border-color: var(--color-text-primary);
}

.pin-slot:focus {
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--color-primary);
}

.pin-slot:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  border-color: var(--color-border);
}

.pin-slot.has-error {
  border-color: var(--color-error);
}

.pin-slot.has-error:focus {
  box-shadow: inset 0 0 0 1px var(--color-error);
}

.pin-error {
  margin: 0;
  font-size: var(--text-xs);
  line-height: 1.4;
  color: var(--color-error);
  text-align: center;
}
</style>
