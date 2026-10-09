import type { DBProvider } from '@/db/db.provider';
import { drizzleUserRepository, type UserRepository } from '@/core/user';
import {
  drizzleSessionRepository,
  drizzleVerificationCodeRepository,
  type SessionRepository,
  type VerificationCodeRepository,
} from '@/core/auth';
import { drizzleMediaRepository, type MediaRepository } from '@/core/media';

interface Repositories {
  userRepository: UserRepository;
  sessionRepository: SessionRepository;
  verificationCodeRepository: VerificationCodeRepository;
  mediaRepository: MediaRepository;
}

export function initRepositories(dbProvider: DBProvider): Repositories {
  return {
    userRepository: drizzleUserRepository(dbProvider),
    sessionRepository: drizzleSessionRepository(dbProvider),
    verificationCodeRepository: drizzleVerificationCodeRepository(dbProvider),
    mediaRepository: drizzleMediaRepository(dbProvider),
  };
}
