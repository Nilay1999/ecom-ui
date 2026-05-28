import { AxiosError } from 'axios';

/**
 * Pull a human-readable message out of an error.
 * Backend errors are wrapped as { message, status, ... }; fall back otherwise.
 */
export function extractApiError(err: unknown, fallback = 'Something went wrong.'): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (err.message) return err.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
