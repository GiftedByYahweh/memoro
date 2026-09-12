import { eq } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { sessionsTable } from '@/db/schema/sessions';
import type { Session } from '../entities/session.entity';
import { toSessionEntity } from '../mappers/session.mapper';
import type { CreateSessionData, SessionRepository } from './session.repository';

export function drizzleSessionRepository(dbProvider: DBProvider): SessionRepository {
  return {
    create: async (data: CreateSessionData): Promise<Session> => {
      const [row] = await dbProvider
        .current()
        .insert(sessionsTable)
        .values({
          userId: data.userId,
          tokenHash: data.tokenHash,
          expiresAt: data.expiresAt,
          userAgent: data.userAgent ?? null,
          ipAddress: data.ipAddress ?? null,
        })
        .returning();

      if (!row) throw new Error('Failed to create session');
      return toSessionEntity(row);
    },

    findByTokenHash: async (tokenHash: string): Promise<Session | null> => {
      const [row] = await dbProvider
        .current()
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.tokenHash, tokenHash))
        .limit(1);
      return row ? toSessionEntity(row) : null;
    },

    deleteByTokenHash: async (tokenHash: string): Promise<void> => {
      await dbProvider
        .current()
        .delete(sessionsTable)
        .where(eq(sessionsTable.tokenHash, tokenHash));
    },

    deleteById: async (id: string): Promise<void> => {
      await dbProvider.current().delete(sessionsTable).where(eq(sessionsTable.id, id));
    },

    deleteByUserId: async (userId: string): Promise<void> => {
      await dbProvider.current().delete(sessionsTable).where(eq(sessionsTable.userId, userId));
    },
  };
}
