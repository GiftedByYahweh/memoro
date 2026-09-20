<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CreateMediaResponseDto } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import { useMediaUpload } from '@/composables/useMediaUpload';
import { useToast } from '@/composables/useToast';
import { MEDIA_UI_CONSTANTS, MEDIA_UPLOAD_LIMITS } from '@/constants/media.constants';
import MediaUploadZone from './MediaUploadZone.vue';

const emit = defineEmits<{
  success: [response: CreateMediaResponseDto];
  cancel: [];
}>();

const { t } = useI18n();
const { showSuccess, showError } = useToast();
const { isLocating, getCurrentPosition } = useGeolocation();
const {
  file,
  previewUrl,
  mediaType,
  latitude,
  longitude,
  isUploading,
  error,
  clearFile,
  processSelectedFile,
  setCoordinates,
  submitUpload,
} = useMediaUpload();

const hasLocation = computed(() => latitude.value !== null && longitude.value !== null);

const formattedCoordinates = computed(() => {
  if (latitude.value === null || longitude.value === null) return '';
  return `${latitude.value.toFixed(4)}, ${longitude.value.toFixed(4)}`;
});

async function handleDetectLocation(): Promise<void> {
  try {
    const coords = await getCurrentPosition();
    setCoordinates(coords.lat, coords.lng);
  } catch {
    showError(t('map.locationError'), MEDIA_UPLOAD_LIMITS.LOCATION_TOAST_DURATION_MS);
  }
}

function handleRemoveLocation(): void {
  setCoordinates(null, null);
}

async function handleSubmit(): Promise<void> {
  if (!file.value) {
    showError(t('media.fileRequired'), MEDIA_UPLOAD_LIMITS.ERROR_TOAST_DURATION_MS);
    return;
  }
  try {
    const result = await submitUpload();
    showSuccess(t('media.uploadSuccess'), MEDIA_UPLOAD_LIMITS.SUCCESS_TOAST_DURATION_MS);
    emit('success', result);
  } catch {
    const message = error.value ? t(error.value) : t('media.uploadFailed');
    showError(message, MEDIA_UPLOAD_LIMITS.ERROR_TOAST_DURATION_MS);
  }
}
</script>

<template>
  <form class="media-create-form" novalidate @submit.prevent="handleSubmit">
    <MediaUploadZone
      :preview-url="previewUrl"
      :media-type="mediaType"
      :file-name="file?.name"
      :disabled="isUploading"
      @select="processSelectedFile"
      @remove="clearFile"
    />

    <div class="meta-section">
      <div class="section-header">
        <span class="section-title">{{ t('media.location') }}</span>
      </div>

      <div v-if="hasLocation" class="location-badge">
        <div class="badge-content">
          <AppIcon name="navigation" :size="MEDIA_UI_CONSTANTS.NAVIGATION_ICON_SIZE" color="primary" />
          <span class="badge-text">{{ formattedCoordinates }}</span>
        </div>
        <button
          type="button"
          class="badge-remove-btn"
          :aria-label="t('common.clear')"
          :disabled="isUploading"
          @click="handleRemoveLocation"
        >
          <AppIcon name="close" :size="MEDIA_UI_CONSTANTS.PREVIEW_ICON_SIZE" color="inherit" />
        </button>
      </div>

      <button
        v-else
        type="button"
        class="location-btn"
        :disabled="isLocating || isUploading"
        @click="handleDetectLocation"
      >
        <AppIcon name="navigation" :size="MEDIA_UI_CONSTANTS.NAVIGATION_ICON_SIZE" color="inherit" />
        <span>{{ isLocating ? t('media.locating') : t('media.attachLocation') }}</span>
      </button>
    </div>

    <div class="form-actions">
      <AppButton
        type="submit"
        variant="primary"
        size="lg"
        block
        :disabled="!file || isUploading"
        :loading="isUploading"
      >
        {{ t('media.submit') }}
      </AppButton>
      <AppButton
        type="button"
        variant="ghost"
        size="md"
        block
        :disabled="isUploading"
        @click="emit('cancel')"
      >
        {{ t('common.cancel') }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.media-create-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  width: 100%;
}

.meta-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.location-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-subtle);
}

.badge-content {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.badge-text {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.badge-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.badge-remove-btn:hover {
  color: var(--color-text-primary);
}

.location-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-subtle);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.location-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.location-btn:hover:not(:disabled) {
  color: var(--color-text-primary);
  border-color: var(--border-hover);
  background-color: var(--color-surface-elevated);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: auto;
}
</style>
