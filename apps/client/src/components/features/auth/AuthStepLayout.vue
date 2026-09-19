<script setup lang="ts">
import AppBackButton from '@/components/shared/AppBackButton.vue';
import AppText from '@/components/shared/AppText.vue';

interface Props {
  title: string;
  description?: string;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  showBack: true,
});

const emit = defineEmits<{
  back: [];
}>();
</script>

<template>
  <div class="step-container">
    <div class="step-header">
      <AppBackButton v-if="showBack" @click="emit('back')" />
      <AppText variant="h3" color="primary">{{ title }}</AppText>
      <slot name="description">
        <AppText v-if="description" variant="body-sm" color="secondary">
          {{ description }}
        </AppText>
      </slot>
    </div>

    <slot />

    <div v-if="$slots.actions" class="step-actions">
      <slot name="actions" />
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

.step-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  text-align: center;
  margin-bottom: var(--space-xs);
}

.step-actions {
  margin-top: var(--space-md);
}

:deep(.highlight) {
  color: var(--color-text-primary);
  font-weight: 500;
}
</style>
