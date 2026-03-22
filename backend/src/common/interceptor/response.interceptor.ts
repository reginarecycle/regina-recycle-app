import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((result) => {
        // If result is an array, return it directly as data
        if (Array.isArray(result)) {
          return {
            success: true,
            statusCode: res.statusCode,
            message: 'Request successful',
            data: result,
            timestamp: new Date().toISOString(),
          };
        }

        // If result is an object with a message property
        if (result && typeof result === 'object' && 'message' in result) {
          const { message, ...data } = result;
          return {
            success: true,
            statusCode: res.statusCode,
            message,
            data: Object.keys(data).length ? data : null,
            timestamp: new Date().toISOString(),
          };
        }

        // Everything else
        return {
          success: true,
          statusCode: res.statusCode,
          message: 'Request successful',
          data: result ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}