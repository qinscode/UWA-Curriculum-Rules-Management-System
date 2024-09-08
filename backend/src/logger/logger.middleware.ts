import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method // 获取请求方法
    const url = req.originalUrl || req.url // 获取完整 URL
    const params = JSON.stringify(req.params) // 获取路径参数
    const query = JSON.stringify(req.query) // 获取查询参数
    const body = JSON.stringify(req.body) // 获取请求体（POST 等请求）
    this.logger.log(
      `Method: ${method}, URL: ${url}, Params: ${params}, Query: ${query}, Body: ${body}`
    )
    next()
  }
}
