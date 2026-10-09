<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { IconName } from '@/assets/icons';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const STEPS: readonly { icon: IconName; textKey: string }[] = [
  { icon: 'share', textKey: 'landing.iosGuide.step1' },
  { icon: 'plus', textKey: 'landing.iosGuide.step2' },
  { icon: 'check', textKey: 'landing.iosGuide.step3' },
];

const { t } = useI18n();
</script>

<template>
  <Transition name="sheet">
    <div v-if="isOpen" class="sheet-overlay" @click.self="emit('close')">
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ios-sheet-title">
        <span class="sheet-handle" aria-hidden="true" />
        <h2 id="ios-sheet-title" class="sheet-title">{{ t('landing.iosGuide.title') }}</h2>
        <ol class="sheet-steps">
          <li v-for="step in STEPS" :key="step.textKey" class="sheet-step">
            <span class="step-icon">
              <AppIcon :name="step.icon" :size="20" />
            </span>
            <span>{{ t(step.textKey) }}</span>
          </li>
        </ol>
        <AppButton size="lg" block @click="emit('close')">
          {{ t('landing.iosGuide.gotIt') }}
        </AppButton>
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
  background-color: var(--color-scrim);
}

.sheet {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  width: 100%;
  max-width: 448px;
  padding: var(--space-sm) var(--space-xl) calc(var(--safe-bottom) + var(--space-xl));
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-3);
}

.sheet-handle {
  align-self: center;
  width: 32px;
  height: 4px;
  border-radius: var(--radius-full);
  background-color: var(--color-border-strong);
}

.sheet-title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 400;
  color: var(--color-text-primary);
}

.sheet-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sheet-step {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
  line-height: 1.4;
  color: var(--color-text-primary);
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity var(--transition-normal);
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform var(--transition-normal);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
