<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/shared/AppButton.vue';

interface Props {
  title?: string;
  description?: string;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  showBack: true,
});

const emit = defineEmits<{
  back: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="step-container">
    <slot />

    <div v-if="$slots.actions || showBack" class="step-actions">
      <slot name="actions" />

      <div v-if="showBack" class="back-action">
        <AppButton variant="secondary" size="lg" block @click="emit('back')">
          {{ t('nav.back', 'Назад') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  width: 100%;
}

.step-actions {
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.back-action {
  width: 100%;
}

:deep(.highlight) {
  color: var(--color-text-primary);
  font-weight: 500;
}
</style>
