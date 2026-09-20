import { createMediaResponseSchema, createMediaSchema } from '@memoro/shared';

export const createMediaRouteSchema = {
  body: createMediaSchema,
  response: {
    200: createMediaResponseSchema,
  },
};
