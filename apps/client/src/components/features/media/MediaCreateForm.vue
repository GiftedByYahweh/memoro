<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MediaDto } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import { useMediaUpload } from '@/composables/useMediaUpload';
import { useToast } from '@/composables/useToast';
import { MEDIA_UI_CONSTANTS, MEDIA_UPLOAD_LIMITS } from '@/constants/media.constants';
import MediaUploadZone from './MediaUploadZone.vue';
import LocationPickerModal from './LocationPickerModal.vue';

const emit = defineEmits<{
  success: [response: MediaDto];
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
  address,
  isResolvingAddress,
  locationSource,
  isUploading,
  error,
  clearFile,
  processSelectedFile,
  setCoordinates,
  submitUpload,
} = useMediaUpload();

const isMapPickerOpen = ref(false);
const hasLocation = computed(() => latitude.value !== null && longitude.value !== null);

const displayAddress = computed(() => {
  if (isResolvingAddress.value) return t('media.resolvingAddress');
  if (address.value) return address.value;
  if (hasLocation.value && latitude.value !== null && longitude.value !== null) {
    return `${latitude.value.toFixed(4)}, ${longitude.value.toFixed(4)}`;
  }
  return t('media.locationPlaceholder');
});

const SOURCE_LABEL_KEYS = {
  exif: 'media.sourceExif',
  device: 'media.sourceGps',
  map: 'media.sourceMap',
} as const;

const sourceLabel = computed(() => {
  const source = locationSource.value;
  return source ? t(SOURCE_LABEL_KEYS[source]) : '';
});

async function handleDetectLocation(): Promise<void> {
  try {
    const coords = await getCurrentPosition();
    await setCoordinates(coords.lat, coords.lng, 'device');
  } catch {
    showError(t('map.locationError'), MEDIA_UPLOAD_LIMITS.LOCATION_TOAST_DURATION_MS);
  }
}

function handleRemoveLocation(): void {
  void setCoordinates(null, null, null);
}

function handleMapSelect(coords: { lat: number; lng: number }): void {
  isMapPickerOpen.value = false;
  void setCoordinates(coords.lat, coords.lng, 'map');
}

async function handleFileSelect(selectedFile: File): Promise<void> {
  await processSelectedFile(selectedFile);
  if (error.value) {
    showError(t(error.value), MEDIA_UPLOAD_LIMITS.ERROR_TOAST_DURATION_MS);
  }
}

async function handleSubmit(): Promise<void> {
  if (!file.value) {
    showError(t('media.fileRequired'), MEDIA_UPLOAD_LIMITS.ERROR_TOAST_DURATION_MS);
    return;
  }
  if (!hasLocation.value) {
    showError(t('media.locationRequired'), MEDIA_UPLOAD_LIMITS.ERROR_TOAST_DURATION_MS);
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
      @select="handleFileSelect"
      @remove="clearFile"
    />

    <div class="meta-section">
      <div class="section-header">
        <span class="section-title">
          {{ t('media.location') }} <span class="required-star">*</span>
        </span>
        <span v-if="sourceLabel" class="source-badge">{{ sourceLabel }}</span>
      </div>

      <div class="location-field" :class="{ 'has-value': hasLocation }">
        <div class="field-icon-wrapper">
          <AppIcon
            name="navigation"
            :size="MEDIA_UI_CONSTANTS.NAVIGATION_ICON_SIZE"
            :color="hasLocation ? 'primary' : 'inherit'"
          />
        </div>
        <span class="field-value-text" :class="{ placeholder: !hasLocation }">
          {{ displayAddress }}
        </span>
        <button
          v-if="hasLocation"
          type="button"
          class="field-clear-btn"
          :disabled="isUploading"
          :aria-label="t('media.clearLocation')"
          @click="handleRemoveLocation"
        >
          <AppIcon
            name="close"
            :size="MEDIA_UI_CONSTANTS.PREVIEW_ICON_SIZE"
            color="inherit"
          />
        </button>
      </div>

      <div class="location-controls">
        <AppButton
          variant="secondary"
          size="sm"
          :disabled="isLocating || isUploading"
          @click="handleDetectLocation"
        >
          <template #icon-left>
            <AppIcon
              name="navigation"
              :size="MEDIA_UI_CONSTANTS.PREVIEW_ICON_SIZE"
              color="inherit"
            />
          </template>
          {{ isLocating ? t('media.locating') : t('media.detectGps') }}
        </AppButton>

        <AppButton
          variant="secondary"
          size="sm"
          :disabled="isUploading"
          @click="isMapPickerOpen = true"
        >
          <template #icon-left>
            <AppIcon
              name="target"
              :size="MEDIA_UI_CONSTANTS.PREVIEW_ICON_SIZE"
              color="inherit"
            />
          </template>
          {{ t('media.pickOnMap') }}
        </AppButton>
      </div>
    </div>

    <div class="form-actions">
      <AppButton
        type="submit"
        variant="primary"
        size="lg"
        block
        :disabled="!file || !hasLocation || isUploading || isResolvingAddress"
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

    <LocationPickerModal
      v-if="isMapPickerOpen"
      :initial-lat="latitude"
      :initial-lng="longitude"
      @select="handleMapSelect"
      @close="isMapPickerOpen = false"
    />
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
  gap: var(--space-sm);
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

.required-star {
  color: var(--color-primary);
}

.source-badge {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px var(--space-xs);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-elevated);
  color: var(--color-primary);
  border: 1px solid var(--border-subtle);
}

.location-field {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-subtle);
  min-height: 44px;
}

.location-field.has-value {
  border-color: var(--border-focus);
}

.field-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.field-value-text {
  flex: 1;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field-value-text.placeholder {
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.field-clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
}

.field-clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.field-clear-btn:hover:not(:disabled) {
  color: var(--color-error);
  background-color: var(--color-surface-card);
}

.location-controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}




.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: auto;
}
</style>
