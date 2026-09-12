import { z } from 'zod';
import { AUTH_CONSTRAINTS } from './auth.constants';
import type { RegisterDto, LoginDto } from './auth.types';

export const registerSchema: z.ZodType<RegisterDto> = z.object({
  email: z.string().trim().toLowerCase().email().max(AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH),
  password: z
    .string()
    .min(AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH)
    .max(AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH),
});

export const loginSchema: z.ZodType<LoginDto> = z.object({
  email: z.string().trim().toLowerCase().email().max(AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH),
  password: z.string().min(1),
});
