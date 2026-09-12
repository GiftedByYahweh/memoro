<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppText from '@/components/shared/AppText.vue';

interface Props {
  isRegister?: boolean;
}

withDefaults(defineProps<Props>(), {
  isRegister: false,
});

const LOGO_SIZE = 64;

const { t } = useI18n();
</script>

<template>
  <div class="auth-header">
    <div class="logo-wrapper">
      <AppIcon name="logo" :size="LOGO_SIZE" />
    </div>

    <AppText as="h1" variant="h1" color="primary" class="title">
      {{ t('auth.title') }}
    </AppText>

    <div class="subtitle-wrapper">
      <Transition name="subtitle-fade" mode="out-in">
        <AppText
          :key="isRegister ? 'reg' : 'log'"
          as="p"
          variant="body-sm"
          color="secondary"
          class="subtitle"
        >
          {{ isRegister ? t('auth.registerSubtitle') : t('auth.subtitle') }}
        </AppText>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: var(--space-xl);
}

.logo-wrapper {
  margin-bottom: var(--space-md);
}

.title {
  letter-spacing: -0.02em;
  margin-bottom: var(--space-2xs);
}

.subtitle-wrapper {
  min-height: calc(var(--space-lg) * 2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.subtitle {
  color: var(--color-text-secondary);
  max-width: 280px;
  line-height: 1.4;
}

.subtitle-fade-enter-active,
.subtitle-fade-leave-active {
  transition: opacity var(--transition-fast);
}

.subtitle-fade-enter-from,
.subtitle-fade-leave-to {
  opacity: 0;
}
</style>
