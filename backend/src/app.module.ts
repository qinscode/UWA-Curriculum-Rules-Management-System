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
import { RequirementsModule } from './requirements/requirements.module'
import { PresetCoursesModule } from './preset-courses/preset-courses.module'
import { PresetRulesModule } from './preset-rules/preset-rules.module'
import { PresetRequirementsModule } from './preset-requirements/preset-requirements.module'

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
    PresetCoursesModule,
    PresetRulesModule,
    PresetRequirementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
