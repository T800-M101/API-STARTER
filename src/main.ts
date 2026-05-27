import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // 1. Set the global prefix
  app.setGlobalPrefix('api');

  // 1. DocumentBuilder Configuration
  const config = new DocumentBuilder()
    .setTitle('API Starter')
    .setDescription('The API documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  // 2. Document creation
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  // 3. Mounted at /api/auth/docs
  SwaggerModule.setup('api/auth/docs', app, documentFactory);

  // Optional: Enable CORS if your frontend is on a different port
  app.enableCors({
    origin: (origin: any, callback: any) => {
      // Allow requests without a source (such as Postman, curl)
      if (!origin) return callback(null, true);

      // List of permitted origins
      const allowedOrigins = [
        'http://localhost:4200',
        'http://localhost:3001',
        'http://localhost:3000',
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📝 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
}
bootstrap();
