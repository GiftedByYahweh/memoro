import { requestUploadUrlSchema, uploadUrlResponseSchema } from '@memoro/shared';

export const requestUploadUrlRouteSchema = {
  body: requestUploadUrlSchema,
  response: {
    200: uploadUrlResponseSchema,
  },
};
