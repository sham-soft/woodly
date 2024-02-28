import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return '1Вас приветствует сервис обработки платежей Woodly!';
    }
}