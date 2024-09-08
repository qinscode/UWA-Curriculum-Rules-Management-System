import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RulesModule } from './rules/rules.module'
import { DocumentsModule } from './documents/documents.module'
import { AppDataSource } from './data-source'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { CoursesModule } from './courses/courses.module'
import { LoggerMiddleware } from './logger/logger.middleware'
import { LoggerInterceptor } from './logger/logger.interceptor' // 引入拦截器
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RequirementsModule } from './requirements/requirements.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    RulesModule,
    DocumentsModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    RequirementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // 全局应用拦截器
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 应用中间件
      .forRoutes('*') // 捕获所有路由
  }
}
