import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    // app.enableCors({
    //     origin: '*',
    //     methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
    //     credentials: true,
    //     allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-control-allow-credentials,
    //       Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer,
    //       Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma',
    // });

    const config = new DocumentBuilder()
        .setTitle('Woodly')
        .setDescription('The woodly API description')
        .setVersion('1.0')
        .addServer('https://woodly-azure.vercel.app/')
        .addServer('http://localhost:3000/')
        .addBearerAuth()
        .addSecurityRequirements('bearer')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();