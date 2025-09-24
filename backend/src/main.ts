import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api') // set global prefix
  
  // 配置 CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://localhost:3000',
      'https://localhost:3001',
      /^https?:\/\/.*\.fudong\.dev$/,  // 允许所有 fudong.dev 子域名
      /^https?:\/\/.*\.vercel\.app$/,  // 允许 Vercel 部署
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  })
  
  await app.listen(6015)
}
bootstrap()
