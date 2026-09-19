import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendVerificationCodeSchema,
  verifyCodeSchema,
} from '@memoro/shared';

const registerRouteSchema = {
  body: registerSchema,
};

const loginRouteSchema = {
  body: loginSchema,
};

const sendVerificationCodeRouteSchema = {
  body: sendVerificationCodeSchema,
};

const verifyCodeRouteSchema = {
  body: verifyCodeSchema,
};

const resetPasswordRouteSchema = {
  body: resetPasswordSchema,
};

export {
  registerRouteSchema,
  loginRouteSchema,
  sendVerificationCodeRouteSchema,
  verifyCodeRouteSchema,
  resetPasswordRouteSchema,
};
