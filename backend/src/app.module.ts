import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RulesModule } from './rules/rules.module'
import { DocumentsModule } from './documents/documents.module'
import { SettingsModule } from './settings/settings.module'
import { AppDataSource } from './data-source'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    RulesModule,
    DocumentsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
