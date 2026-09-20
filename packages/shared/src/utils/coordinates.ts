import { z } from 'zod';

export const COORDINATES_LIMITS = {
  MIN_LATITUDE: -90,
  MAX_LATITUDE: 90,
  MIN_LONGITUDE: -180,
  MAX_LONGITUDE: 180,
} as const;

export const CoordinatesSchema = z.object({
  latitude: z.number().min(COORDINATES_LIMITS.MIN_LATITUDE).max(COORDINATES_LIMITS.MAX_LATITUDE),
  longitude: z.number().min(COORDINATES_LIMITS.MIN_LONGITUDE).max(COORDINATES_LIMITS.MAX_LONGITUDE),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
