import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // conexion con front
  app.enableCors();

  // reconoce los archivos de "uploads"
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  await app.listen(4300);
  console.log(`Servidor corriendo en http://localhost:4300`);
}
bootstrap();
