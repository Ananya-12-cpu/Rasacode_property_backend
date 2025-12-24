import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Enable global serialization interceptor
  // app.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(app.get(Reflector), {
  //     // This strategy excludes all properties by default unless marked with @Expose()
  //     strategy: 'excludeAll',
  //     // Ensure only properties present in the DTO are exposed
  //     excludeExtraneousValues: true,
  //     enableImplicitConversion: true,
  //   }),
  // );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
