import type { UserSex } from '@memoro/shared';

export interface Profile {
  id: string;
  userId: string;
  username: string | null;
  avatar: string | null;
  sex: UserSex | null;
  createdAt: Date;
  updatedAt: Date;
}
