import type { UserSex } from './constants';

export interface ProfileDto {
  readonly id: string;
  readonly userId: string;
  readonly username: string | null;
  readonly avatar: string | null;
  readonly sex: UserSex | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
