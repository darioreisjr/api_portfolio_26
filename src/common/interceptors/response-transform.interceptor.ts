import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../types/paginated-result.type';

interface TransformedResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, TransformedResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T>> {
    return next.handle().pipe(
      map((value) => {
        if (value && typeof value === 'object' && 'data' in value && 'meta' in value) {
          const paginated = value as PaginatedResult<unknown>;
          return {
            data: paginated.data,
            meta: {
              ...paginated.meta,
              timestamp: new Date().toISOString(),
            },
          } as unknown as TransformedResponse<T>;
        }

        return {
          data: value,
          meta: { timestamp: new Date().toISOString() },
        } as TransformedResponse<T>;
      }),
    );
  }
}
