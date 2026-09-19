export const UserSex = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
} as const;

export type UserSex = (typeof UserSex)[keyof typeof UserSex];

export const PROFILE_CONSTRAINTS = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  SEX_MAX_LENGTH: 20,
} as const;
