import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: env.port
    }
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory(errors) {
          const message = Object.fromEntries(errors.map(e => ([e.property,e.constraints]))); 
          throw new RpcException({ status: HttpStatus.PRECONDITION_FAILED, message })
      },
    })
  )
  await app.listen();
}
bootstrap();
