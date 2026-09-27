import cookieParser = require('cookie-parser');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 掛載 cookie-parser 中間件，確保 NestJS/Express 能正確解析 Request Cookie 中的 access_token
  app.use(cookieParser());

  // 啟用 CORS 供前端 (localhost:1111) 跨域呼叫與帶上 Credentials (Cookies)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 前端期望 API 前綴為 /api
  app.setGlobalPrefix('api/v1');

  /**
   * 全域 ValidationPipe — DTO 欄位驗證
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}).join(', '))
          .filter(Boolean);
        return new BadRequestException(
          messages.length > 0 ? messages.join('; ') : 'Validation failed',
        );
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}/api`);
}

bootstrap();
