import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { tap } from 'rxjs/operators'
import { classToPlain } from 'class-transformer'
import { Observable } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.url
    const processId = process.pid
    const now = Date.now()
    const timestamp = new Date().toLocaleString() // 获取当前时间的字符串格式

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now
        console.log(
          `[Nest] ${processId}  - ${timestamp}     LOG [RouterExplorer] Mapped {${url}, ${method}} route +${responseTime}ms`
        )
      })
    )
  }
}
