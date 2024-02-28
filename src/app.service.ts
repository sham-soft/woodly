import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'kkВас приветствует сервис обработки платежей Woodly!';
    }
}