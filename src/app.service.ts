import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return '57Вас приветствует сервис обработки платежей Woodly!';
    }
}