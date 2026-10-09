<script setup lang="ts" generic="TValue extends string">
import { useId } from 'vue';
import AppIcon from './AppIcon.vue';

export interface ChipOption<TOptionValue extends string> {
  value: TOptionValue;
  label: string;
}

interface Props {
  modelValue: TValue | null;
  options: readonly ChipOption<TValue>[];
  label?: string;
  ariaLabel?: string;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  ariaLabel: undefined,
  error: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: TValue];
}>();

const labelId = `app-chip-group-${useId()}`;
</script>

<template>
  <div class="chip-group-field">
    <span v-if="label" :id="labelId" class="field-label">{{ label }}</span>
    <div
      class="chip-group"
      role="radiogroup"
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="label ? undefined : ariaLabel"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="radio"
        :aria-checked="option.value === modelValue"
        :class="[
          'chip',
          { 'is-selected': option.value === modelValue, 'has-error': Boolean(error) },
        ]"
        @click="emit('update:modelValue', option.value)"
      >
        <AppIcon v-if="option.value === modelValue" name="check" :size="18" />
        <span>{{ option.label }}</span>
      </button>
    </div>
    <p v-if="error" class="field-message is-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.chip-group-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  height: 36px;
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  outline: none;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}

.chip:hover {
  background-color: var(--color-state-hover);
}

.chip:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.chip.is-selected {
  border-color: transparent;
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.chip.has-error:not(.is-selected) {
  border-color: var(--color-error);
}
</style>
