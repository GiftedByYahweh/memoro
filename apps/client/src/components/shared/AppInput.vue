<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { useI18n } from 'vue-i18n';

import AppIcon from './AppIcon.vue';

interface Props {
  modelValue?: string | number;
  label?: string;
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
    <label v-if="label" :for="inputId" class="input-label">
      <span>{{ label }}</span>
      <span v-if="required" class="required-star" aria-hidden="true">*</span>
    </label>

    <div :class="['input-wrapper', `size-${size}`]">
      <div v-if="$slots['icon-left']" class="input-icon-slot leading">
        <slot name="icon-left" />
      </div>

      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :maxlength="maxlength"
        class="native-input"
        @input="handleInput"
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

        <div v-if="$slots['icon-right']" class="input-icon-slot trailing">
          <slot name="icon-right" />
        </div>
      </div>
    </div>

    <p v-if="error" class="validation-message error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" class="validation-message hint">
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

.input-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.required-star {
  color: var(--color-primary);
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.input-wrapper:hover {
  border-color: rgb(255 255 255 / 16%);
}

.input-wrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(224 104 75 / 18%);
}

.size-sm {
  height: 34px;
  padding: 0 var(--space-sm);
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
}

.size-md {
  height: 44px;
  padding: 0 var(--space-md);
  border-radius: var(--radius-lg);
  font-size: 0.9375rem;
}

.size-lg {
  height: 52px;
  padding: 0 var(--space-lg);
  border-radius: var(--radius-xl);
  font-size: 1rem;
}

.native-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  color-scheme: dark;
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
  box-shadow: 0 0 0 1000px var(--color-surface-card) inset;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: var(--color-text-primary);
}

.has-error .input-wrapper {
  border-color: var(--color-error);
}

.has-error .input-wrapper:focus-within {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgb(255 69 58 / 18%);
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.is-disabled .input-wrapper:hover {
  border-color: var(--border-subtle);
}

.is-disabled .native-input {
  cursor: not-allowed;
}

.input-icon-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.input-icon-slot.leading {
  margin-right: var(--space-xs);
}

.input-icon-slot.trailing {
  margin-left: var(--space-xs);
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
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  outline: none;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.action-btn:hover {
  color: var(--color-text-primary);
  background-color: rgb(255 255 255 / 8%);
}

.validation-message {
  margin: 0;
  padding-left: 2px;
  font-size: 0.75rem;
  line-height: 1.4;
}

.validation-message.error {
  color: var(--color-error);
}

.validation-message.hint {
  color: var(--color-text-tertiary);
}
</style>
