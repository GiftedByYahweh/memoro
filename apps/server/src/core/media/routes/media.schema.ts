import {
  abortMediaUploadSchema,
  completeMediaUploadSchema,
  createMediaResponseSchema,
  createMediaSchema,
  mediaIdParamSchema,
  mediaResponseSchema,
} from '@memoro/shared';

export const createMediaRouteSchema = {
  body: createMediaSchema,
  response: {
    200: createMediaResponseSchema,
  },
};

export const completeMediaRouteSchema = {
  params: mediaIdParamSchema,
  body: completeMediaUploadSchema,
  response: {
    200: mediaResponseSchema,
  },
};

export const abortMediaRouteSchema = {
  params: mediaIdParamSchema,
  body: abortMediaUploadSchema,
};
