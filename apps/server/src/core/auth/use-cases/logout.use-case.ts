import { hashToken } from '@/common/crypto/crypto';
import type { UseCase } from '@/common/use-case';
import type { SessionRepository } from '../repositories/session.repository';

interface LogoutInput {
  sessionToken: string | undefined;
}

interface LogoutUseCaseDeps {
  sessionRepository: SessionRepository;
}

export type LogoutUseCase = UseCase<LogoutInput>;

export function logoutUseCase(deps: LogoutUseCaseDeps): LogoutUseCase {
  const { sessionRepository } = deps;

  return async (input: LogoutInput): Promise<void> => {
    if (!input.sessionToken) return;
    const tokenHash = hashToken(input.sessionToken);
    await sessionRepository.deleteByTokenHash(tokenHash);
  };
}
