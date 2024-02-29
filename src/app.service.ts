import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return '234Вас приветствует сервис обработки платежей Woodly!';
    }
}