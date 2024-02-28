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
        origin: function (origin, callback) {
            const allowedOrigins = ['http://localhost:5173'];
            if (allowedOrigins.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
        },
    })
    await app.listen(3000);
}
bootstrap();