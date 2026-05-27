 
 import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
 
 export function setupGlobalConfig(app: INestApplication): void {
   // 1. CORS: This should be the first step. If a request does not comply with CORS,
   // It is best to reject it immediately before processing anything else.
   app.enableCors({
     origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
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
         callback(new Error('Not allowed by CORS'), false);
       }
     },
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
     allowedHeaders: 'Content-Type, Accept, Authorization',
     credentials: true,
   });
 
   // 2. Global Prefix: Defines the base structure of your URLs
   app.setGlobalPrefix('api');

   // 3. Interceptors: Applied to the response (output)
   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

   // 4. Pipes: Applied to the input (validation)
   app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,       // Remove incoming properties that are not in the DTO
        forbidNonWhitelisted: true, // It throws an error if they send fields that are not allowed.
        transform: true,       // Automatically transforms payloads into class instances
        stopAtFirstError: true // stops the validation at the first error found
      }),
    );
 }