import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Truck Management System API')
    .setDescription('Comprehensive truck management system with fleet management, trip tracking, and reporting')
    .setVersion('1.0')
    .addCookieAuth('access_token', {
      type: 'http',
      in: 'cookie',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token stored in HTTP cookie for authentication',
    })
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management operations')
    .addTag('Drivers', 'Driver management operations')
    .addTag('Clients', 'Client management operations')
    .addTag('Trucks', 'Fleet management operations')
    .addTag('Trips', 'Trip management and tracking')
    .addTag('Trip Expenses', 'Trip expense management')
    .addTag('Reports', 'Business intelligence and reporting')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
