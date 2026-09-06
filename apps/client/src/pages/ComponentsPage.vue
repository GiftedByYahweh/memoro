<script setup lang="ts">
import { ref } from 'vue';

import { type IconName } from '@/assets/icons';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppInput from '@/components/shared/AppInput.vue';
import AppText from '@/components/shared/AppText.vue';
import { useLocale } from '@/composables/useLocale';

const { currentLocale, toggleLocale } = useLocale();

const allIcons: IconName[] = [
  'book',
  'bookmark',
  'camera',
  'close',
  'compass',
  'edit',
  'eye',
  'eyeOff',
  'filter',
  'flight',
  'folderStar',
  'layers',
  'moreVertical',
  'navigation',
  'photos',
  'plus',
  'search',
  'settings',
  'sun',
  'target',
  'trash',
  'user',
];

const allColors = ['primary', 'secondary', 'tertiary', 'accent', 'error'] as const;

const testInputText = ref('Kyiv, 50.4501° N, 30.5234° E');
const testPassword = ref('archival-pass');
const testSearch = ref('Summer 2024');
const isButtonLoading = ref(false);

function triggerLoading(): void {
  isButtonLoading.value = true;
  window.setTimeout(() => {
    isButtonLoading.value = false;
  }, 1200);
}
</script>

<template>
  <div class="components-page">
    <header class="page-header">
      <div class="header-titles">
        <AppText as="h1" variant="h1" color="primary">Memoro UI System</AppText>
        <AppText as="p" variant="body-sm" color="secondary">
          Dark Archival OLED Foundations & Component Primitives
        </AppText>
      </div>

      <button type="button" class="locale-pill" @click="toggleLocale">
        <AppText variant="caption" weight="bold">{{ currentLocale.toUpperCase() }}</AppText>
      </button>
    </header>

    <section class="section-card">
      <div class="section-header">
        <AppText as="h2" variant="h2" color="primary">Icons & Colors</AppText>
        <AppText as="p" variant="body-sm" color="secondary">
          Extracted SVG vector assets in 24x24 optical grid across design tokens
        </AppText>
      </div>

      <div class="icons-table">
        <div class="icons-row header-row">
          <div class="col-name">
            <AppText variant="label" color="tertiary">Icon Name</AppText>
          </div>
          <div v-for="color in allColors" :key="color" class="col-color">
            <AppText variant="label" color="tertiary">{{ color }}</AppText>
          </div>
        </div>

        <div v-for="iconName in allIcons" :key="iconName" class="icons-row">
          <div class="col-name">
            <AppText variant="mono" color="secondary">{{ iconName }}</AppText>
          </div>
          <div v-for="color in allColors" :key="color" class="col-color">
            <div class="icon-bubble">
              <AppIcon :name="iconName" :color="color" :size="22" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <AppText as="h2" variant="h2" color="primary">Buttons (`AppButton`)</AppText>
        <AppText as="p" variant="body-sm" color="secondary">
          Variants, sizes, loading spinners and icon slots
        </AppText>
      </div>

      <div class="demo-grid">
        <div class="demo-group">
          <AppText variant="label" color="tertiary">Variants</AppText>
          <div class="button-row">
            <AppButton variant="primary">Primary</AppButton>
            <AppButton variant="secondary">Secondary</AppButton>
            <AppButton variant="ghost">Ghost</AppButton>
            <AppButton variant="danger">Danger</AppButton>
          </div>
        </div>

        <div class="demo-group">
          <AppText variant="label" color="tertiary">Sizes</AppText>
          <div class="button-row align-center">
            <AppButton size="sm">Small (34px)</AppButton>
            <AppButton size="md">Medium (44px)</AppButton>
            <AppButton size="lg">Large (52px)</AppButton>
          </div>
        </div>

        <div class="demo-group">
          <AppText variant="label" color="tertiary">Interactive States & Icons</AppText>
          <div class="button-row">
            <AppButton :loading="isButtonLoading" @click="triggerLoading">
              <template #icon-left>
                <AppIcon name="target" :size="18" />
              </template>
              Locate Spot
            </AppButton>

            <AppButton variant="secondary">
              <template #icon-left>
                <AppIcon name="bookmark" :size="18" />
              </template>
              Save to Album
            </AppButton>

            <AppButton size="icon" variant="secondary" aria-label="More">
              <AppIcon name="moreVertical" :size="20" />
            </AppButton>

            <AppButton disabled variant="primary">Disabled</AppButton>
          </div>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <AppText as="h2" variant="h2" color="primary">Inputs (`AppInput`)</AppText>
        <AppText as="p" variant="body-sm" color="secondary">
          Dark autofill, labels, clearable action and password visibility
        </AppText>
      </div>

      <div class="inputs-grid">
        <AppInput
          v-model="testInputText"
          label="Location Coordinates"
          placeholder="Enter coordinates..."
        >
          <template #icon-left>
            <AppIcon name="compass" :size="18" />
          </template>
        </AppInput>

        <AppInput
          v-model="testPassword"
          type="password"
          label="Archival Master Key"
          placeholder="••••••••"
        />

        <AppInput
          v-model="testSearch"
          type="search"
          placeholder="Filter archival photos..."
          clearable
        >
          <template #icon-left>
            <AppIcon name="search" :size="18" />
          </template>
        </AppInput>

        <AppInput
          model-value="Invalid coordinates string"
          label="Validation Error State"
          error="Coordinates must be in DD format (e.g. 50.4501, 30.5234)"
        />

        <AppInput model-value="Locked System Field" label="Disabled State" disabled />
      </div>
    </section>

    <section class="section-card">
      <div class="section-header">
        <AppText as="h2" variant="h2" color="primary">Typography Scale (`AppText`)</AppText>
        <AppText as="p" variant="body-sm" color="secondary">
          Plus Jakarta Sans design-system tokens
        </AppText>
      </div>

      <div class="typography-list">
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">h1 / 32px</AppText>
          <AppText as="h1" variant="h1" color="primary">Lifetime Media Storage</AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">h2 / 24px</AppText>
          <AppText as="h2" variant="h2" color="primary">Spatial & Temporal Memory</AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">h3 / 20px</AppText>
          <AppText as="h3" variant="h3" color="primary">Archival Collections & Spots</AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">title / 18px</AppText>
          <AppText variant="title" color="primary">Street Level Zoom Detail</AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">body / 15px</AppText>
          <AppText variant="body" color="primary">
            Every photo uploaded without an album is preserved as an individual memory with exact
            coordinates and timestamp.
          </AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">body-sm / 13px</AppText>
          <AppText variant="body-sm" color="secondary">
            Muted metadata and subtitle explanation text.
          </AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">caption / 12px</AppText>
          <AppText variant="caption" color="tertiary">14.2 MB • 4032x3024 • iPhone 15 Pro</AppText>
        </div>
        <div class="typo-row">
          <AppText variant="mono" color="tertiary">label / 12px</AppText>
          <AppText variant="label" color="accent">Archival Category</AppText>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.components-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  min-height: 100vh;
  padding: var(--space-2xl) var(--space-xl);
  background-color: var(--color-canvas);
  color: var(--color-text-primary);
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.locale-pill {
  padding: 6px 14px;
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.locale-pill:hover {
  color: var(--color-text-primary);
  border-color: rgb(255 255 255 / 25%);
}

.section-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.icons-table {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.icons-row {
  display: grid;
  grid-template-columns: 160px repeat(5, 1fr);
  align-items: center;
  padding: var(--space-xs) var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
  background-color: var(--color-surface-card);
}

.icons-row:last-child {
  border-bottom: none;
}

.header-row {
  background-color: var(--color-surface-elevated);
}

.col-name {
  display: flex;
  align-items: center;
}

.col-color {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-bubble {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background-color: var(--color-surface-elevated);
}

.demo-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.demo-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.button-row.align-center {
  align-items: center;
}

.inputs-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 480px;
}

.typography-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.typo-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: baseline;
  gap: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border-subtle);
}

.typo-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>
