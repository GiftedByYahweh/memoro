import type { VerificationCodeType } from './constants';
import type { UserSex } from '../profiles/constants';

export interface AuthUserDto {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;
}

export interface AuthSessionDto {
  readonly user: AuthUserDto;
}

export interface RegisterDto {
  readonly email: string;
  readonly password: string;
  readonly username: string;
  readonly gender: UserSex;
}

export interface VerifyCodeDto {
  readonly email: string;
  readonly code: string;
  readonly type: VerificationCodeType;
}

export interface LoginDto {
  readonly email: string;
  readonly password: string;
}

export interface SendVerificationCodeDto {
  readonly email: string;
  readonly type: VerificationCodeType;
}

export interface ResetPasswordDto {
  readonly email: string;
  readonly password: string;
}
