<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MediaType } from '@memoro/shared';
import AppIcon from '@/components/shared/AppIcon.vue';
import AppIconButton from '@/components/shared/AppIconButton.vue';
import { MEDIA_ACCEPT_ATTRIBUTE } from '@/constants/media.constants';

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
  <div class="upload-zone">
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
      :class="['dropzone', { 'is-dragging': isDragging, 'is-disabled': disabled }]"
      role="button"
      tabindex="0"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <span class="dropzone-icon">
        <AppIcon name="camera" :size="32" />
      </span>
      <p class="dropzone-title">{{ t('media.uploadPrompt') }}</p>
      <p class="dropzone-formats">{{ t('media.supportedFormats') }}</p>
    </div>

    <div v-else class="preview">
      <video
        v-if="mediaType === MediaType.VIDEO"
        :src="previewUrl"
        controls
        playsinline
        class="preview-media"
      />
      <img v-else :src="previewUrl" :alt="fileName ?? ''" class="preview-media" />
      <AppIconButton
        variant="floating"
        size="sm"
        icon="close"
        class="remove-btn"
        :label="t('media.removeFile')"
        :disabled="disabled"
        @click="emit('remove')"
      />
    </div>
  </div>
</template>

<style scoped>
.upload-zone {
  width: 100%;
}

.hidden-file-input {
  display: none;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  min-height: 220px;
  padding: var(--space-xl) var(--space-md);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-xl);
  background-color: var(--color-bg-subtle);
  cursor: pointer;
  outline: none;
  transition:
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.dropzone:hover,
.dropzone:focus-visible,
.dropzone.is-dragging {
  border-color: var(--color-primary);
  background-color: var(--color-primary-container);
}

.dropzone.is-disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.dropzone-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-2xs);
  border-radius: var(--radius-full);
  background-color: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.dropzone-title {
  margin: 0;
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--color-text-primary);
}

.dropzone-formats {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.preview {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background-color: var(--color-surface-variant);
}

.preview-media {
  display: block;
  width: 100%;
  max-height: 380px;
  object-fit: contain;
}

.remove-btn {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
}
</style>
