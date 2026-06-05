import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../types/paginated-result.type';

interface TransformedResponse {
  data: unknown;
  meta: Record<string, unknown>;
}

interface AuthResult {
  accessToken: string;
  token?: string;
  tokenType: string;
  expiresIn: number;
}

interface AuthResponse extends TransformedResponse {
  accessToken: string;
  token: string;
  tokenType: string;
  expiresIn: number;
  data: AuthResult & { token: string };
}

type ApiResponse = AuthResponse | TransformedResponse;

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse> {
    return next.handle().pipe(
      map((value) => {
        const timestamp = new Date().toISOString();

        if (isAuthResult(value)) {
          const authResult = {
            ...value,
            token: value.token ?? value.accessToken,
          };

          return {
            ...authResult,
            data: authResult,
            meta: { timestamp },
          };
        }

        if (isPaginatedResult(value)) {
          return {
            data: value.data,
            meta: {
              ...value.meta,
              timestamp,
            },
          };
        }

        return {
          data: value,
          meta: { timestamp },
        };
      }),
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isAuthResult(value: unknown): value is AuthResult {
  return (
    isRecord(value) &&
    typeof value.accessToken === 'string' &&
    typeof value.tokenType === 'string' &&
    typeof value.expiresIn === 'number'
  );
}

function isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
  return isRecord(value) && Array.isArray(value.data) && isRecord(value.meta);
}
