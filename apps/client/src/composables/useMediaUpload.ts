import { reactive, toRefs } from 'vue';
import {
  MediaType,
  type CreateMediaDto,
  type MediaDto,
} from '@memoro/shared';
import { mediaService } from '@/services/media.service';

import { extractExifMetadata, type ExifMetadata } from '@/utils/exif';
import { geocodingService } from '@/services/geocoding.service';
import { resolveFileContentType } from '@/utils/media-file';

interface MediaDimensions {
  readonly width: number;
  readonly height: number;
}

interface VideoMetadata extends MediaDimensions {
  readonly duration: number;
}

export type LocationSource = 'exif' | 'device' | 'map' | null;

interface MediaUploadState {
  file: File | null;
  previewUrl: string | null;
  mediaType: MediaType;
  dimensions: MediaDimensions | null;
  duration: number | null;
  captureTime: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  isResolvingAddress: boolean;
  locationSource: LocationSource;
  cameraModel: string;
  isUploading: boolean;
  error: string | null;
}

function resolveMediaType(mimeType: string): MediaType {
  return mimeType.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE;
}

function validateMediaFile(file: File): string | null {
  if (!resolveFileContentType(file)) return 'media.unsupportedFormat';
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

function attachSpatialMetadata(payload: CreateMediaDto, state: MediaUploadState): void {
  if (state.latitude !== null) {
    payload.latitude = state.latitude;
  }
  if (state.longitude !== null) {
    payload.longitude = state.longitude;
  }
}

function attachVisualMetadata(payload: CreateMediaDto, state: MediaUploadState): void {
  if (state.dimensions && state.dimensions.width > 0) {
    payload.width = state.dimensions.width;
  }
  if (state.dimensions && state.dimensions.height > 0) {
    payload.height = state.dimensions.height;
  }
  if (state.duration !== null && state.duration > 0) {
    payload.duration = state.duration;
  }
  if (state.cameraModel.trim().length > 0) {
    payload.cameraModel = state.cameraModel.trim();
  }
}

function buildPayload(activeFile: File, state: MediaUploadState): CreateMediaDto {
  const contentType = resolveFileContentType(activeFile);
  if (!contentType) {
    throw new Error('media.unsupportedFormat');
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const captureTime =
    state.captureTime.length > 0
      ? state.captureTime
      : new Date(activeFile.lastModified).toISOString();

  const payload: CreateMediaDto = {
    fileName: activeFile.name,
    contentType,
    sizeBytes: activeFile.size,
    type: state.mediaType,
    captureTime,
    timezone: timeZone,
  };
  attachSpatialMetadata(payload, state);
  attachVisualMetadata(payload, state);
  return payload;
}

async function uploadActiveMedia(
  activeFile: File,
  state: MediaUploadState,
): Promise<MediaDto> {
  const payload = buildPayload(activeFile, state);
  const res = await mediaService.create(payload);
  if (!res.success) throw new Error(String(res.code));
  return mediaService.uploadFile(activeFile, res.data);
}

function resetMediaState(state: MediaUploadState): void {
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
  state.file = null;
  state.previewUrl = null;
  state.dimensions = null;
  state.duration = null;
  state.captureTime = '';
  state.latitude = null;
  state.longitude = null;
  state.address = null;
  state.isResolvingAddress = false;
  state.locationSource = null;
  state.cameraModel = '';
  state.error = null;
}

async function updateCoordinatesState(
  state: MediaUploadState,
  lat: number | null,
  lng: number | null,
  source: LocationSource = null,
): Promise<void> {
  state.latitude = lat;
  state.longitude = lng;
  state.locationSource = source;
  if (lat === null || lng === null) {
    state.address = null;
    state.isResolvingAddress = false;
    return;
  }
  state.isResolvingAddress = true;
  try {
    state.address = await geocodingService.reverseGeocode(lat, lng);
  } finally {
    state.isResolvingAddress = false;
  }
}

function applyExifData(state: MediaUploadState, exif: ExifMetadata | null): void {
  if (!exif) return;
  if (exif.captureTime) state.captureTime = exif.captureTime;
  if (exif.cameraModel) state.cameraModel = exif.cameraModel;
  if (exif.latitude !== null && exif.longitude !== null) {
    void updateCoordinatesState(state, exif.latitude, exif.longitude, 'exif');
  }
}

async function handleFileSelection(state: MediaUploadState, selectedFile: File): Promise<void> {
  resetMediaState(state);
  const validationError = validateMediaFile(selectedFile);
  if (validationError) {
    state.error = validationError;
    return;
  }
  const resolvedType = resolveFileContentType(selectedFile);
  const objectUrl = URL.createObjectURL(selectedFile);
  state.file = selectedFile;
  state.mediaType = resolveMediaType(resolvedType ?? selectedFile.type);
  state.previewUrl = objectUrl;
  state.captureTime = new Date(selectedFile.lastModified).toISOString();

  const [meta, exif] = await Promise.all([
    extractMetadata(selectedFile, objectUrl),
    extractExifMetadata(selectedFile),
  ]);
  state.dimensions = meta.dimensions;
  state.duration = meta.duration;
  applyExifData(state, exif);
}

export function useMediaUpload() {
  const state = reactive<MediaUploadState>({
    file: null,
    previewUrl: null,
    mediaType: MediaType.IMAGE,
    dimensions: null,
    duration: null,
    captureTime: '',
    latitude: null,
    longitude: null,
    address: null,
    isResolvingAddress: false,
    locationSource: null,
    cameraModel: '',
    isUploading: false,
    error: null,
  });

  function clearFile(): void {
    resetMediaState(state);
  }

  function processSelectedFile(selectedFile: File): Promise<void> {
    return handleFileSelection(state, selectedFile);
  }

  function setCoordinates(
    lat: number | null,
    lng: number | null,
    source: LocationSource = null,
  ): Promise<void> {
    return updateCoordinatesState(state, lat, lng, source);
  }

  async function submitUpload(): Promise<MediaDto> {
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
