<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'label';
  path?: string;
  params?: Record<string, unknown>;
  variant?: 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'body-sm' | 'caption' | 'label' | 'mono';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'inherit';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'span',
  path: undefined,
  params: undefined,
  variant: 'body',
  color: 'inherit',
  weight: undefined,
  align: undefined,
  truncate: false,
});

const { t } = useI18n();

const content = computed(() => {
  if (props.path) {
    return t(props.path, props.params ?? {});
  }
  return '';
});
</script>

<template>
  <component
    :is="as"
    :class="[
      'app-text',
      `variant-${variant}`,
      `color-${color}`,
      weight ? `weight-${weight}` : undefined,
      align ? `align-${align}` : undefined,
      { 'is-truncate': truncate },
    ]"
  >
    <slot>{{ content }}</slot>
  </component>
</template>

<style scoped>
.app-text {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
}

.variant-h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.variant-h2 {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.variant-h3 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.variant-title {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.variant-body {
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
}

.variant-body-sm {
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.45;
}

.variant-caption {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
}

.variant-label {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.variant-mono {
  font-family: monospace;
  font-size: 0.8125rem;
  line-height: 1.4;
  letter-spacing: -0.02em;
}

.color-primary {
  color: var(--color-text-primary);
}

.color-secondary {
  color: var(--color-text-secondary);
}

.color-tertiary {
  color: var(--color-text-tertiary);
}

.color-accent {
  color: var(--color-primary);
}

.color-error {
  color: var(--color-error);
}

.color-inherit {
  color: inherit;
}

.weight-regular {
  font-weight: 400;
}

.weight-medium {
  font-weight: 500;
}

.weight-semibold {
  font-weight: 600;
}

.weight-bold {
  font-weight: 700;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

.is-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
