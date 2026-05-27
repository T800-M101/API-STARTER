import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/bootstrap-helpers/swagger.config';
import { setupGlobalConfig } from './config/bootstrap-helpers/global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupGlobalConfig(app);
  setupSwagger(app);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📝 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
}
bootstrap();


