import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalResponseInterceptor } from '@core/interceptors/response.interceptor';
import { GlobalExceptionFilter } from '@core/exceptions/globalException.filter';
import * as cookieParser from 'cookie-parser';
import { MAIN_PORT } from '@environments';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Cấu hình CORS (Cross-Origin Resource Sharing)
  app.enableCors();

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API Documentation for My Project')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter())

  const PORT = MAIN_PORT;
  await app.listen(PORT);
  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
}
bootstrap();
