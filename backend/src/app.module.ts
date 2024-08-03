import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RulesModule } from './rules/rules.module';
import { DocumentsModule } from './documents/documents.module';
import { SettingsModule } from './settings/settings.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options as TypeOrmModuleOptions),
        RulesModule,
    DocumentsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}