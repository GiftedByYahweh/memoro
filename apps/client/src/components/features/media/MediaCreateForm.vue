<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { MediaDto } from '@memoro/shared';
import AppButton from '@/components/shared/AppButton.vue';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppIconButton from '@/components/shared/AppIconButton.vue';
import { useGeolocation } from '@/composables/useGeolocation';
import { useMediaUpload } from '@/composables/useMediaUpload';
import { useToast } from '@/composables/useToast';
import { MEDIA_UPLOAD_LIMITS } from '@/constants/media.constants';
import MediaUploadZone from './MediaUploadZone.vue';
import LocationPickerModal from './LocationPickerModal.vue';

const emit = defineEmits<{
  success: [response: MediaDto];
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

    <section class="location-section">
      <div :class="['location-row', { 'has-value': hasLocation }]">
        <AppIcon name="mapPin" :size="20" :color="hasLocation ? 'accent' : 'secondary'" />
        <span class="location-text">{{ displayAddress }}</span>
        <span v-if="sourceLabel" class="source-chip">{{ sourceLabel }}</span>
        <AppIconButton
          v-if="hasLocation"
          size="sm"
          icon="close"
          :label="t('media.clearLocation')"
          :disabled="isUploading"
          @click="handleRemoveLocation"
        />
      </div>

      <div class="location-actions">
        <AppButton
          variant="secondary"
          size="sm"
          :loading="isLocating"
          :disabled="isUploading"
          @click="handleDetectLocation"
        >
          <template #icon-left>
            <AppIcon name="target" :size="18" />
          </template>
          {{ t('media.detectGps') }}
        </AppButton>
        <AppButton
          variant="secondary"
          size="sm"
          :disabled="isUploading"
          @click="isMapPickerOpen = true"
        >
          <template #icon-left>
            <AppIcon name="mapPin" :size="18" />
          </template>
          {{ t('media.pickOnMap') }}
        </AppButton>
      </div>
    </section>

    <AppButton
      type="submit"
      size="lg"
      block
      class="submit-btn"
      :disabled="!file || !hasLocation || isResolvingAddress"
      :loading="isUploading"
    >
      {{ t('media.submit') }}
    </AppButton>

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
  flex: 1;
  flex-direction: column;
  gap: var(--space-lg);
  width: 100%;
}

.location-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.location-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 48px;
  padding: 0 var(--space-xs) 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.location-row.has-value {
  border-color: var(--color-primary);
}

.location-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: var(--text-md);
  color: var(--color-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.has-value .location-text {
  color: var(--color-text-primary);
}

.source-chip {
  flex-shrink: 0;
  padding: 2px var(--space-xs);
  border-radius: var(--radius-sm);
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
  font-size: var(--text-xs);
  font-weight: 500;
}

.location-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.submit-btn {
  margin-top: auto;
}
</style>
