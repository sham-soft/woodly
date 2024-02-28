import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return '2Вас приветствует сервис обработки платежей Woodly!';
    }
}