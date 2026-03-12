import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(({ message, ...data }) => ({
        success: true,
        statusCode: res.statusCode,
        message: message ?? 'Request successful',
        data: Object.keys(data).length ? data : null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}