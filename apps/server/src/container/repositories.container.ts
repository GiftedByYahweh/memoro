import type { DBProvider } from '@/db/db.provider';
import { drizzleUserRepository, type UserRepository } from '@/core/user';
import { drizzleProfileRepository, type ProfileRepository } from '@/core/profile';
import {
  drizzleSessionRepository,
  drizzleVerificationCodeRepository,
  type SessionRepository,
  type VerificationCodeRepository,
} from '@/core/auth';
import { drizzleMediaRepository, type MediaRepository } from '@/core/media';

export interface Repositories {
  userRepository: UserRepository;
  profileRepository: ProfileRepository;
  sessionRepository: SessionRepository;
  verificationCodeRepository: VerificationCodeRepository;
  mediaRepository: MediaRepository;
}

export function initRepositories(dbProvider: DBProvider): Repositories {
  return {
    userRepository: drizzleUserRepository(dbProvider),
    profileRepository: drizzleProfileRepository(dbProvider),
    sessionRepository: drizzleSessionRepository(dbProvider),
    verificationCodeRepository: drizzleVerificationCodeRepository(dbProvider),
    mediaRepository: drizzleMediaRepository(dbProvider),
  };
}
