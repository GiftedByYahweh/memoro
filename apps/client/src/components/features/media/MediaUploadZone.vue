<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MediaType } from '@memoro/shared';
import AppIcon from '@/components/shared/AppIcon.vue';
import { MEDIA_ACCEPT_ATTRIBUTE, MEDIA_UI_CONSTANTS } from '@/constants/media.constants';

interface Props {
  previewUrl: string | null;
  mediaType: MediaType;
  fileName?: string;
  disabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  select: [file: File];
  remove: [];
}>();

const { t } = useI18n();
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function triggerFileInput(): void {
  fileInput.value?.click();
}

function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    emit('select', file);
  }
  target.value = '';
}

function handleDrop(event: DragEvent): void {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    emit('select', file);
  }
}
</script>

<template>
  <div class="upload-zone-wrapper">
    <input
      ref="fileInput"
      type="file"
      class="hidden-file-input"
      :accept="MEDIA_ACCEPT_ATTRIBUTE"
      :disabled="disabled"
      @change="handleFileChange"
    />

    <div
      v-if="!previewUrl"
      class="dropzone-box"
      :class="{ 'is-dragging': isDragging, 'is-disabled': disabled }"
      role="button"
      tabindex="0"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div class="icon-circle">
        <AppIcon name="camera" :size="MEDIA_UI_CONSTANTS.EMPTY_ZONE_ICON_SIZE" color="primary" />
      </div>
      <p class="dropzone-title">{{ t('media.uploadPrompt') }}</p>
      <p class="dropzone-subtitle">{{ t('media.supportedFormats') }}</p>
      <button type="button" class="choose-btn" :disabled="disabled" @click.stop="triggerFileInput">
        <AppIcon name="plus" :size="MEDIA_UI_CONSTANTS.ACTION_ICON_SIZE" color="inherit" />
        <span>{{ t('media.chooseFile') }}</span>
      </button>
    </div>

    <div v-else class="preview-box">
      <video
        v-if="mediaType === MediaType.VIDEO"
        :src="previewUrl"
        controls
        playsinline
        class="preview-element"
      />
      <img v-else :src="previewUrl" :alt="fileName ?? ''" class="preview-element" />

      <button
        type="button"
        class="remove-btn"
        :aria-label="t('media.removeFile')"
        :disabled="disabled"
        @click="emit('remove')"
      >
        <AppIcon name="close" :size="MEDIA_UI_CONSTANTS.PREVIEW_ICON_SIZE" color="inherit" />
      </button>

      <div v-if="fileName" class="preview-meta">
        <span class="preview-filename">{{ fileName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-zone-wrapper {
  width: 100%;
}

.hidden-file-input {
  display: none;
}

.dropzone-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  min-height: 240px;
  padding: var(--space-xl) var(--space-md);
  border: 2px dashed var(--border-subtle);
  border-radius: var(--radius-xl);
  background-color: var(--color-surface-card);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.dropzone-box:hover,
.dropzone-box.is-dragging {
  border-color: var(--color-primary);
  background-color: var(--color-surface-elevated);
}

.dropzone-box.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-elevated);
  border: 1px solid var(--border-subtle);
  margin-bottom: var(--space-2xs);
}

.dropzone-title {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin: 0;
}

.dropzone-subtitle {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
  text-align: center;
  margin: 0;
}

.choose-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2xs);
  margin-top: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background-color: var(--color-surface-floating);
  color: var(--color-text-primary);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.choose-btn:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--border-hover);
}

.preview-box {
  position: relative;
  width: 100%;
  max-height: 380px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--color-surface-card);
  border: 1px solid var(--border-subtle);
}

.preview-element {
  width: 100%;
  max-height: 380px;
  object-fit: contain;
  display: block;
  background-color: var(--color-oled-black);
}

.remove-btn {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--scrim-overlay);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-subtle);
  color: var(--color-white);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.remove-btn:hover {
  background-color: var(--color-error);
  transform: scale(1.05);
}

.preview-meta {
  padding: var(--space-xs) var(--space-md);
  background-color: var(--color-surface-card);
  border-top: 1px solid var(--border-subtle);
}

.preview-filename {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>
