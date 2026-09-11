import { z } from 'zod';
import { AUTH_CONSTRAINTS } from './auth.constants.js';
import type { RegisterDto, LoginDto } from './auth.types.js';

export const registerSchema: z.ZodType<RegisterDto> = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(
      AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH,
      `Email must not exceed ${String(AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH)} characters`,
    ),
  password: z
    .string()
    .min(
      AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${String(AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH)} characters long`,
    )
    .max(
      AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH,
      `Password must not exceed ${String(AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH)} characters`,
    ),
});

export const loginSchema: z.ZodType<LoginDto> = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(
      AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH,
      `Email must not exceed ${String(AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH)} characters`,
    ),
  password: z.string().min(1, 'Password is required'),
});
