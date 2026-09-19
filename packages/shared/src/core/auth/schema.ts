import { z } from 'zod';
import { AUTH_CONSTRAINTS, VerificationCodeType } from './constants';
import { PROFILE_CONSTRAINTS, UserSex } from '../profiles/constants';
import type {
  RegisterDto,
  LoginDto,
  SendVerificationCodeDto,
  ResetPasswordDto,
  VerifyCodeDto,
} from './types';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH);

const passwordSchema = z
  .string()
  .min(AUTH_CONSTRAINTS.PASSWORD_MIN_LENGTH)
  .max(AUTH_CONSTRAINTS.PASSWORD_MAX_LENGTH);

export const registerSchema: z.ZodType<RegisterDto> = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: z
    .string()
    .trim()
    .min(PROFILE_CONSTRAINTS.USERNAME_MIN_LENGTH)
    .max(PROFILE_CONSTRAINTS.USERNAME_MAX_LENGTH),
  gender: z.enum([UserSex.MALE, UserSex.FEMALE, UserSex.OTHER]),
});

export const loginSchema: z.ZodType<LoginDto> = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const sendVerificationCodeSchema: z.ZodType<SendVerificationCodeDto> = z.object({
  email: emailSchema,
  type: z.enum([VerificationCodeType.REGISTRATION, VerificationCodeType.PASSWORD_RESET]),
});

export const verifyCodeSchema: z.ZodType<VerifyCodeDto> = z.object({
  email: emailSchema,
  code: z.string().length(AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH),
  type: z.enum([VerificationCodeType.REGISTRATION, VerificationCodeType.PASSWORD_RESET]),
});

export const resetPasswordSchema: z.ZodType<ResetPasswordDto> = z.object({
  email: emailSchema,
  password: passwordSchema,
});
