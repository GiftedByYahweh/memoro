import type { UserSex } from '@memoro/shared';

export const RESEND_COOLDOWN_SECONDS = 60;
export const COUNTDOWN_TICK_MS = 1000;

export const REGISTRATION_STEPS = ['details', 'verify', 'password'] as const;
export type RegistrationStep = (typeof REGISTRATION_STEPS)[number];

export const RESTORE_STEPS = ['email', 'verify', 'password'] as const;
export type RestoreStep = (typeof RESTORE_STEPS)[number];

export interface AuthDetails {
  username: string;
  email: string;
  sex: UserSex;
}
