import { z } from 'zod';
import { AUTH_CONSTRAINTS } from './constants';
import type { RegisterDto, LoginDto } from './types';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH);

export const registerSchema: z.ZodType<RegisterDto> = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH)
    .max(AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH),
});

export const loginSchema: z.ZodType<LoginDto> = z.object({
  email: emailSchema,
  password: z.string().min(1),
});
