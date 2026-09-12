import { createTransport } from './httpTransport';
import { authApi } from './apiClient';

const transport = createTransport('');

export const apiClient = {
  auth: authApi(transport),
};
