import { loginSchema, registerSchema } from '@memoro/shared';

const registerRouteSchema = {
  body: registerSchema,
};

const loginRouteSchema = {
  body: loginSchema,
};

export { registerRouteSchema, loginRouteSchema };
