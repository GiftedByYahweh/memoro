<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';

const ICON_SIZE_SHIELD = 16;
const { t } = useI18n();
</script>

<template>
  <div class="auth-footer">
    <AppIcon name="shield" :size="ICON_SIZE_SHIELD" color="tertiary" />
    <span class="note-text">{{ t('auth.encryptedNote') }}</span>
  </div>
</template>

<style scoped>
.auth-footer {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: var(--space-2xl);
  text-align: start;
}

.note-text {
  line-height: 1.4;
  text-align: start;
}
</style>
