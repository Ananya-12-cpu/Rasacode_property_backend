import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for incoming requests
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe(),
    //   {
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    //   transform: true,
    // }
  );
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

  const config = new DocumentBuilder()
    .setTitle('Property Management API')
    .setDescription('APIs for managing properties')
    .setVersion('1.0')
    .addBearerAuth() // for JWT (optional)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
