import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const whitelist = [
    'http://localhost:3000',
    'http://localhost:5173',
];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        allowedHeaders: ['content-type'],
        origin: 'http://localhost:5173',
        credentials: true,
    });
    await app.listen(3000);
}
bootstrap();