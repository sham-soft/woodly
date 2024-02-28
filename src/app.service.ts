import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'bvvВас приветствует сервис обработки платежей Woodly!';
    }
}