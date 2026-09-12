<script setup lang="ts">
import { useRouter } from 'vue-router';
import { RoutePaths } from '@/router/routes';
import { usePwaInstall } from '@/composables/usePwaInstall';
import LandingHero from '@/components/features/landing/LandingHero.vue';
import LandingFeatures from '@/components/features/landing/LandingFeatures.vue';
import IosInstallSheet from '@/components/features/pwa/IosInstallSheet.vue';

const router = useRouter();
const { isStandalone, isIosGuideOpen, promptInstall, closeIosGuide } = usePwaInstall();

async function handleInstall(): Promise<void> {
  await promptInstall();
}

function handleNavigateApp(): void {
  void router.push({ name: RoutePaths.map.name });
}
</script>

<template>
  <main class="landing-page">
    <LandingHero
      :is-standalone="isStandalone"
      @install="handleInstall"
      @navigate-app="handleNavigateApp"
    />
    <LandingFeatures />
    <IosInstallSheet :is-open="isIosGuideOpen" @close="closeIosGuide" />
  </main>
</template>

<style scoped>
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xl);
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md) var(--space-3xl);
}
</style>
