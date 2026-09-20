import { createTransport } from './httpTransport';
import { authApi, mediaApi } from './apiClient';

const transport = createTransport('');

export const apiClient = {
  auth: authApi(transport),
  media: mediaApi(transport),
};
