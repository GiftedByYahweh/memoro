import { createTransport } from './httpTransport';
import { authApi } from './apiClient';

const transport = createTransport('/api');

export const apiClient = {
  auth: authApi(transport),
};
