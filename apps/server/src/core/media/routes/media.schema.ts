import {
  abortMediaUploadSchema,
  completeMediaUploadSchema,
  createMediaSchema,
  mediaIdParamSchema,
} from '@memoro/shared';

export const createMediaRouteSchema = {
  body: createMediaSchema,
};

export const completeMediaRouteSchema = {
  params: mediaIdParamSchema,
  body: completeMediaUploadSchema,
};

export const abortMediaRouteSchema = {
  params: mediaIdParamSchema,
  body: abortMediaUploadSchema,
};
