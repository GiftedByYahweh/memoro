import type { AllowedContentType } from '@memoro/shared';
import { EXTENSION_MIME_MAP, MIME_ALIAS_MAP } from '@/constants/media.constants';

export function resolveFileContentType(file: File): AllowedContentType | null {
  const mimeMatch = MIME_ALIAS_MAP[file.type.toLowerCase()];
  if (mimeMatch) return mimeMatch;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MIME_MAP[ext] ?? null;
}
