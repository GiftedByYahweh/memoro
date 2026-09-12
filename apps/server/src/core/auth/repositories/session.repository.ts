import type { Session } from '../entities/session.entity';

export interface CreateSessionData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent: string | undefined;
  ipAddress: string | undefined;
}

export interface SessionRepository {
  create(data: CreateSessionData): Promise<Session>;
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
