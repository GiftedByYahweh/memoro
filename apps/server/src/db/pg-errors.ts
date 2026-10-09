import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError } from 'pg';

const UNIQUE_VIOLATION_CODE = '23505';

export function isUniqueViolation(error: unknown, constraint: string | undefined): boolean {
  const cause = error instanceof DrizzleQueryError ? error.cause : error;
  return (
    cause instanceof DatabaseError &&
    cause.code === UNIQUE_VIOLATION_CODE &&
    cause.constraint === constraint
  );
}
