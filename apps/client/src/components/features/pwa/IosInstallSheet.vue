<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();

function handleClose(): void {
  emit('close');
}
</script>

<template>
  <Transition name="sheet-fade">
    <div v-if="isOpen" class="sheet-overlay" @click.self="handleClose">
      <div class="sheet-modal" role="dialog" aria-modal="true">
        <div class="sheet-handle" />

        <div class="sheet-header">
          <div class="sheet-logo-badge">
            <AppIcon name="logo" :size="24" color="accent" />
          </div>
          <h2 class="sheet-title">{{ t('landing.iosGuide.title') }}</h2>
        </div>

        <div class="sheet-steps">
          <div class="step-item">
            <div class="step-badge">
              <AppIcon name="share" :size="18" color="accent" />
            </div>
            <div class="step-content">
              <span class="step-number">1</span>
              <p class="step-text">{{ t('landing.iosGuide.step1') }}</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-badge">
              <AppIcon name="plus" :size="18" color="accent" />
            </div>
            <div class="step-content">
              <span class="step-number">2</span>
              <p class="step-text">{{ t('landing.iosGuide.step2') }}</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-badge">
              <AppIcon name="check" :size="18" color="accent" />
            </div>
            <div class="step-content">
              <span class="step-number">3</span>
              <p class="step-text">{{ t('landing.iosGuide.step3') }}</p>
            </div>
          </div>
        </div>

        <div class="sheet-actions">
          <AppButton variant="secondary" size="lg" block @click="handleClose">
            {{ t('landing.iosGuide.gotIt') }}
          </AppButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: var(--scrim-overlay);
  backdrop-filter: blur(8px);
  padding-bottom: var(--safe-bottom);
}

.sheet-modal {
  width: 100%;
  max-width: 440px;
  background-color: var(--color-surface-card);
  border-top-left-radius: var(--radius-xl);
  border-top-right-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);
  border-bottom: none;
  padding: var(--space-md) var(--space-xl) var(--space-xl);
  box-shadow: var(--shadow-elevated);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background-color: var(--border-hover-strong);
  border-radius: var(--radius-full);
  align-self: center;
}

.sheet-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.sheet-logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--glow-primary);
  border: 1px solid var(--border-focus-primary);
  border-radius: var(--radius-md);
}

.sheet-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.sheet-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.step-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
}

.step-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  background-color: var(--glow-primary);
}

.step-content {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.step-number {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
}

.step-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--color-text-secondary);
}

.sheet-actions {
  margin-top: var(--space-xs);
}

.sheet-fade-enter-active,
.sheet-fade-leave-active {
  transition: opacity var(--transition-fast);
}

.sheet-fade-enter-active .sheet-modal,
.sheet-fade-leave-active .sheet-modal {
  transition: transform var(--transition-normal);
}

.sheet-fade-enter-from,
.sheet-fade-leave-to {
  opacity: 0;
}

.sheet-fade-enter-from .sheet-modal,
.sheet-fade-leave-to .sheet-modal {
  transform: translateY(100%);
}
</style>
