import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return '@Вас приветствует сервис обработки платежей Woodly!';
    }
}