 
 import { INestApplication, ValidationPipe } from '@nestjs/common';
 
 export function setupGlobalConfig(app: INestApplication): void {
   app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,       // Remove properties that are not in the DTO
        forbidNonWhitelisted: true, // It throws an error if they send fields that are not allowed.
        transform: true,       // Automatically transforms payloads into class instances
      }),
    );
  
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
  
    // 1. Set the global prefix
    app.setGlobalPrefix('api');
 }