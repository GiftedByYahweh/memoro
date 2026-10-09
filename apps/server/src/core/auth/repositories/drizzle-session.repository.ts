import { eq } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { sessionsTable } from '@/db/schema/sessions';
import type { Session } from '../entities/session.entity';
import { toSessionEntity } from '../mappers/session.mapper';
import type { CreateSessionData, SessionRepository } from './session.repository';

async function createSession(dbProvider: DBProvider, data: CreateSessionData): Promise<Session> {
  const [row] = await dbProvider
    .current()
    .insert(sessionsTable)
    .values({
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
    })
    .returning();

  if (!row) throw new Error('Failed to create session');
  return toSessionEntity(row);
}

async function findSessionByTokenHash(
  dbProvider: DBProvider,
  tokenHash: string,
): Promise<Session | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.tokenHash, tokenHash))
    .limit(1);
  return row ? toSessionEntity(row) : null;
}

async function deleteSessionByTokenHash(dbProvider: DBProvider, tokenHash: string): Promise<void> {
  await dbProvider.current().delete(sessionsTable).where(eq(sessionsTable.tokenHash, tokenHash));
}

async function deleteSessionById(dbProvider: DBProvider, id: string): Promise<void> {
  await dbProvider.current().delete(sessionsTable).where(eq(sessionsTable.id, id));
}

async function deleteSessionsByUserId(dbProvider: DBProvider, userId: string): Promise<void> {
  await dbProvider.current().delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}

export function drizzleSessionRepository(dbProvider: DBProvider): SessionRepository {
  return {
    create: (data: CreateSessionData) => createSession(dbProvider, data),
    findByTokenHash: (tokenHash: string) => findSessionByTokenHash(dbProvider, tokenHash),
    deleteByTokenHash: (tokenHash: string) => deleteSessionByTokenHash(dbProvider, tokenHash),
    deleteById: (id: string) => deleteSessionById(dbProvider, id),
    deleteByUserId: (userId: string) => deleteSessionsByUserId(dbProvider, userId),
  };
}
