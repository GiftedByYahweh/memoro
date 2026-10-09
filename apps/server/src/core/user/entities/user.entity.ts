import type { UserSex } from '@memoro/shared';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string | null;
  sex: UserSex | null;
  createdAt: Date;
  updatedAt: Date;
}
