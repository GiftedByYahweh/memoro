import { generateToken, hashToken } from '@/common/crypto/crypto';
import type { UseCase } from '@/common/use-case';
import type { Session } from '../entities/session.entity';
import type { SessionRepository } from '../repositories/session.repository';

interface CreateSessionInput {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
}

interface CreateSessionOutput {
  rawToken: string;
  session: Session;
  maxAgeSeconds: number;
}

interface CreateSessionDeps {
  sessionRepository: SessionRepository;
  sessionMaxAgeMs: number;
}

export type CreateSessionUseCase = UseCase<CreateSessionInput, CreateSessionOutput>;

export function createSessionUseCase(deps: CreateSessionDeps): CreateSessionUseCase {
  const { sessionMaxAgeMs, sessionRepository } = deps;

  return async (input: CreateSessionInput): Promise<CreateSessionOutput> => {
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + sessionMaxAgeMs);

    const session = await sessionRepository.create({
      userId: input.userId,
      tokenHash,
      expiresAt,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });

    return {
      rawToken,
      session,
      maxAgeSeconds: Math.floor(sessionMaxAgeMs / 1000),
    };
  };
}
