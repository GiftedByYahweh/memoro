import type { sessionsTable } from '@/db/schema/sessions';
import type { Session } from '../entities/session.entity';

export type SessionRow = typeof sessionsTable.$inferSelect;

const toSessionEntity = (row: SessionRow): Session => {
  return {
    id: row.id,
    userId: row.userId,
    tokenHash: row.tokenHash,
    userAgent: row.userAgent,
    ipAddress: row.ipAddress,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
  };
};

export { toSessionEntity };
