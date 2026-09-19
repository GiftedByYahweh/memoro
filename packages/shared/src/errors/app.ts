import type { DomainErrorCode } from './domain';
import type { HttpStatusCode } from './http';

export type AppErrorCode = DomainErrorCode | HttpStatusCode;
