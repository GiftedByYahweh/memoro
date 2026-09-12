<script setup lang="ts">
import { computed, useId } from 'vue';
import AppIcon from './AppIcon.vue';

const CHECK_ICON_SIZE = 12;

interface Props {
  modelValue?: boolean;
  label?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: undefined,
  disabled: false,
  id: undefined,
  name: undefined,
  value: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [value: boolean];
}>();

const autoId = useId();
const checkboxId = computed(() => props.id ?? `app-checkbox-${autoId}`);

function handleChange(event: Event): void {
  if (props.disabled) {
    return;
  }
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', target.checked);
}
</script>

<template>
  <label
    :for="checkboxId"
    :class="['app-checkbox', { 'is-disabled': disabled, 'is-checked': modelValue }]"
  >
    <input
      :id="checkboxId"
      type="checkbox"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      class="native-checkbox"
      @change="handleChange"
    />
    <span class="checkbox-box" aria-hidden="true">
      <AppIcon v-if="modelValue" name="check" :size="CHECK_ICON_SIZE" />
    </span>
    <span v-if="label || $slots.default" class="checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.app-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
  user-select: none;
}

.app-checkbox.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.native-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background-color: var(--color-surface-card);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
  flex-shrink: 0;
}

.is-checked .checkbox-box {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.native-checkbox:focus-visible + .checkbox-box {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--border-focus-primary);
}

.checkbox-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
</style>
