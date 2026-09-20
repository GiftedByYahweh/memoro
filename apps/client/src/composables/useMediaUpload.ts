import { reactive, toRefs } from 'vue';
import {
  ALLOWED_CONTENT_TYPES,
  MediaType,
  type AllowedContentType,
  type CreateMediaDto,
  type CreateMediaResponseDto,
} from '@memoro/shared';
import { mediaService } from '@/services/media.service';

interface MediaDimensions {
  readonly width: number;
  readonly height: number;
}

interface VideoMetadata extends MediaDimensions {
  readonly duration: number;
}

interface MediaUploadState {
  file: File | null;
  previewUrl: string | null;
  mediaType: MediaType;
  dimensions: MediaDimensions | null;
  duration: number | null;
  captureTime: string;
  latitude: number | null;
  longitude: number | null;
  cameraModel: string;
  isUploading: boolean;
  error: string | null;
}

function isAllowedContentType(type: string): type is AllowedContentType {
  return (ALLOWED_CONTENT_TYPES as readonly string[]).includes(type);
}

function resolveMediaType(mimeType: string): MediaType {
  return mimeType.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE;
}

function validateMediaFile(file: File): string | null {
  if (!isAllowedContentType(file.type)) return 'media.unsupportedFormat';
  return null;
}

function extractImageDimensions(url: string): Promise<MediaDimensions> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
}

function extractVideoMetadata(url: string): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: Math.round(video.duration),
      });
    };
    video.onerror = () => {
      resolve({ width: 0, height: 0, duration: 0 });
    };
    video.src = url;
  });
}

async function extractMetadata(file: File, objectUrl: string) {
  if (file.type.startsWith('video/')) {
    const meta = await extractVideoMetadata(objectUrl);
    return { dimensions: { width: meta.width, height: meta.height }, duration: meta.duration };
  }
  const dims = await extractImageDimensions(objectUrl);
  return { dimensions: dims, duration: null };
}

function buildPayload(activeFile: File, state: MediaUploadState): CreateMediaDto {
  const contentType = activeFile.type;
  if (!isAllowedContentType(contentType)) {
    throw new Error('media.unsupportedFormat');
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const payload: CreateMediaDto = {
    fileName: activeFile.name,
    contentType,
    sizeBytes: activeFile.size,
    type: state.mediaType,
    captureTime: state.captureTime,
    timezone: timeZone,
  };
  if (state.latitude !== null) payload.latitude = state.latitude;
  if (state.longitude !== null) payload.longitude = state.longitude;
  if (state.dimensions && state.dimensions.width > 0) payload.width = state.dimensions.width;
  if (state.dimensions && state.dimensions.height > 0) payload.height = state.dimensions.height;
  if (state.duration !== null && state.duration > 0) payload.duration = state.duration;
  if (state.cameraModel.trim().length > 0) payload.cameraModel = state.cameraModel.trim();
  return payload;
}

async function uploadActiveMedia(
  activeFile: File,
  state: MediaUploadState,
): Promise<CreateMediaResponseDto> {
  const payload = buildPayload(activeFile, state);
  const res = await mediaService.create(payload);
  if (!res.success) throw new Error(String(res.code));
  await mediaService.uploadFile(activeFile, res.data);
  return res.data;
}

function resetMediaState(state: MediaUploadState): void {
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
  state.file = null;
  state.previewUrl = null;
  state.dimensions = null;
  state.duration = null;
  state.error = null;
}

export function useMediaUpload() {
  const state = reactive<MediaUploadState>({
    file: null,
    previewUrl: null,
    mediaType: MediaType.IMAGE,
    dimensions: null,
    duration: null,
    captureTime: new Date().toISOString(),
    latitude: null,
    longitude: null,
    cameraModel: '',
    isUploading: false,
    error: null,
  });

  function clearFile(): void {
    resetMediaState(state);
  }

  async function processSelectedFile(selectedFile: File): Promise<void> {
    clearFile();
    const validationError = validateMediaFile(selectedFile);
    if (validationError) {
      state.error = validationError;
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    state.file = selectedFile;
    state.mediaType = resolveMediaType(selectedFile.type);
    state.previewUrl = objectUrl;
    state.captureTime = new Date(selectedFile.lastModified).toISOString();
    const meta = await extractMetadata(selectedFile, objectUrl);
    state.dimensions = meta.dimensions;
    state.duration = meta.duration;
  }

  function setCoordinates(lat: number | null, lng: number | null): void {
    state.latitude = lat;
    state.longitude = lng;
  }

  async function submitUpload(): Promise<CreateMediaResponseDto> {
    if (!state.file) throw new Error('media.fileRequired');
    state.isUploading = true;
    state.error = null;
    try {
      const result = await uploadActiveMedia(state.file, state);
      clearFile();
      return result;
    } finally {
      state.isUploading = false;
    }
  }

  return {
    ...toRefs(state),
    clearFile,
    processSelectedFile,
    setCoordinates,
    submitUpload,
  };
}
