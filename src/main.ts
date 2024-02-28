import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.use(helmet({
    //     crossOriginEmbedderPolicy: false,
    //     crossOriginResourcePolicy: false,
    // }));
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    })
    await app.listen(3000);
}
bootstrap();