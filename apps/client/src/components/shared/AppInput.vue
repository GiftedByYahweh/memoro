<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IconName } from '@/assets/icons';
import AppIcon from './AppIcon.vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  icon?: IconName;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'search' | 'number' | 'tel' | 'url';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  clearable?: boolean;
  id?: string;
  name?: string;
  autocomplete?: string;
  autofocus?: boolean;
  maxlength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: undefined,
  icon: undefined,
  placeholder: '',
  type: 'text',
  size: 'md',
  error: undefined,
  hint: undefined,
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  id: undefined,
  name: undefined,
  autocomplete: undefined,
  autofocus: false,
  maxlength: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
}>();

const { t } = useI18n();

const autoId = useId();
const inputId = computed(() => props.id ?? `app-input-${autoId}`);

const isPasswordVisible = ref(false);

const computedType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password';
  }
  return props.type;
});

const hasValue = computed(() => {
  return props.modelValue !== '';
});

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value =
    props.type === 'number' && target.value !== '' ? Number(target.value) : target.value;
  emit('update:modelValue', value);
}

function handleClear(): void {
  emit('update:modelValue', '');
  emit('clear');
}

function togglePasswordVisibility(): void {
  isPasswordVisible.value = !isPasswordVisible.value;
}
</script>

<template>
  <div
    class="app-input-group"
    :class="{
      'is-disabled': disabled,
      'has-error': Boolean(error),
    }"
  >
    <label v-if="label" :for="inputId" class="field-label">
      <span>{{ label }}</span>
      <span v-if="required" class="required-star" aria-hidden="true">*</span>
    </label>

    <div :class="['input-wrapper', `size-${size}`]">
      <AppIcon v-if="icon" :name="icon" :size="20" color="secondary" class="input-icon" />

      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-label="label ? undefined : placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :maxlength="maxlength"
        class="native-input"
        @input="handleInput"
        @change="handleInput"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <div class="trailing-actions">
        <button
          v-if="clearable && hasValue && !disabled && !readonly"
          type="button"
          class="action-btn"
          :aria-label="t('common.clear')"
          @click="handleClear"
        >
          <AppIcon name="close" :size="16" />
        </button>

        <button
          v-if="type === 'password' && !disabled"
          type="button"
          class="action-btn"
          :aria-label="isPasswordVisible ? t('auth.hidePassword') : t('auth.showPassword')"
          @click="togglePasswordVisibility"
        >
          <AppIcon :name="isPasswordVisible ? 'eyeOff' : 'eye'" :size="18" />
        </button>
      </div>
    </div>

    <p v-if="error" class="field-message is-error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" class="field-message">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
.app-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  width: 100%;
}

.required-star {
  color: var(--color-error);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.input-wrapper:hover {
  border-color: var(--color-text-primary);
}

.input-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--color-primary);
}

.size-sm {
  height: 36px;
  padding: 0 var(--space-sm);
  font-size: var(--text-sm);
}

.size-md {
  height: 48px;
  padding: 0 var(--space-md);
  font-size: var(--text-md);
}

.size-lg {
  height: 56px;
  padding: 0 var(--space-md);
  font-size: var(--text-md);
}

.native-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: inherit;
  outline: none;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: inherit;
}

.native-input::placeholder {
  color: var(--color-text-tertiary);
}

.native-input:autofill,
.native-input:-webkit-autofill {
  -webkit-text-fill-color: var(--color-text-primary);
  box-shadow: 0 0 0 1000px var(--color-surface) inset;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: var(--color-text-primary);
}

.has-error .input-wrapper,
.has-error .input-wrapper:hover {
  border-color: var(--color-error);
}

.has-error .input-wrapper:focus-within {
  border-color: var(--color-error);
  box-shadow: inset 0 0 0 1px var(--color-error);
}

.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.is-disabled .input-wrapper:hover {
  border-color: var(--color-border);
}

.is-disabled .native-input {
  cursor: not-allowed;
}

.input-icon {
  flex-shrink: 0;
  margin-right: var(--space-sm);
}

.trailing-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  outline: none;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
}

.action-btn:hover,
.action-btn:focus-visible {
  color: var(--color-text-primary);
  background-color: var(--color-state-hover);
}
</style>
