<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import type { StepProgress } from '@/composables/useStepFlow';

interface Props {
  title: string;
  progress?: StepProgress;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  progress: undefined,
  showBack: false,
});

const emit = defineEmits<{
  submit: [];
  back: [];
}>();

const { t } = useI18n();
</script>

<template>
  <form class="auth-step" novalidate @submit.prevent="emit('submit')">
    <div class="step-heading">
      <div class="step-header">
        <AppIcon name="logo" :size="40" />
        <div class="step-header-text">
          <h1 class="step-title">{{ title }}</h1>
          <span class="step-brand">{{ t('auth.brand') }}</span>
        </div>
      </div>
      <div
        v-if="progress"
        class="step-progress"
        role="progressbar"
        :aria-valuenow="progress.current"
        :aria-valuemin="1"
        :aria-valuemax="progress.total"
        :aria-label="t('auth.stepOf', { current: progress.current, total: progress.total })"
      >
        <span
          v-for="index in progress.total"
          :key="index"
          :class="['progress-segment', { 'is-done': index <= progress.current }]"
        />
      </div>
      <hr v-else class="step-divider" />
      <p v-if="$slots.description" class="step-description">
        <slot name="description" />
      </p>
    </div>

    <div class="step-body">
      <slot />
    </div>

    <div class="step-actions">
      <slot name="actions" />
      <AppButton v-if="showBack" variant="ghost" size="lg" block @click="emit('back')">
        {{ t('common.back') }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.auth-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  width: 100%;
}

.step-heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.step-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.step-header-text {
  display: flex;
  flex-direction: column;
}

.step-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1.25;
  color: var(--color-text-primary);
}

.step-brand {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.step-progress {
  display: flex;
  gap: var(--space-2xs);
}

.progress-segment {
  flex: 1;
  height: 4px;
  border-radius: var(--radius-full);
  background-color: var(--color-border);
  transition: background-color var(--transition-normal);
}

.progress-segment.is-done {
  background-color: var(--color-primary);
}

.step-divider {
  width: 100%;
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

.step-description {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.5;
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.step-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
</style>
