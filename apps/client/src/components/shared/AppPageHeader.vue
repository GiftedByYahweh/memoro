<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIconButton from './AppIconButton.vue';

interface Props {
  title: string;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  showBack: false,
});

const emit = defineEmits<{
  back: [];
}>();

const { t } = useI18n();
</script>

<template>
  <header class="page-header">
    <AppIconButton
      v-if="showBack"
      icon="arrowLeft"
      :label="t('common.back')"
      class="back-btn"
      @click="emit('back')"
    />
    <h1 class="page-title">{{ title }}</h1>
    <slot name="actions" />
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  min-height: 48px;
  margin-bottom: var(--space-lg);
}

.back-btn {
  margin-left: calc(var(--space-xs) * -1);
}

.page-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: 400;
  color: var(--color-text-primary);
}
</style>
