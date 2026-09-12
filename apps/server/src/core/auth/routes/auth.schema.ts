import type { FastifySchema } from 'fastify';
import { AUTH_CONSTRAINTS } from '@memoro/shared';

const registerRouteSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        maxLength: AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH,
      },
      password: {
        type: 'string',
        minLength: AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH,
        maxLength: AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH,
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      required: ['success', 'data', 'timestamp'],
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          required: ['id', 'email', 'createdAt'],
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
        timestamp: { type: 'number' },
      },
    },
  },
};

export { registerRouteSchema };
