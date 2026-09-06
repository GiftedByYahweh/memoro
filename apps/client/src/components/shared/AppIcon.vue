<script setup lang="ts">
import { computed } from 'vue';
import { icons, type IconName } from '@/assets/icons';

interface Props {
  name?: IconName;
  src?: string;
  size?: number | string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'inherit';
  alt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  src: undefined,
  size: 18,
  color: 'inherit',
  alt: '',
});

const resolvedSrc = computed(() => {
  if (props.name) {
    return icons[props.name];
  }
  return props.src ?? '';
});

const sizeStyle = computed(() => {
  return typeof props.size === 'number' ? `${String(props.size)}px` : props.size;
});

const COLOR_MAP: Record<NonNullable<Props['color']>, string> = {
  primary: 'var(--color-text-primary)',
  secondary: 'var(--color-text-secondary)',
  tertiary: 'var(--color-text-tertiary)',
  accent: 'var(--color-primary)',
  error: 'var(--color-error)',
  inherit: 'currentcolor',
};

const colorStyle = computed(() => COLOR_MAP[props.color]);
</script>

<template>
  <span
    class="app-icon"
    :style="{
      width: sizeStyle,
      height: sizeStyle,
      color: colorStyle,
    }"
    role="img"
    :aria-label="alt"
    v-html="resolvedSrc"
  />
</template>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
