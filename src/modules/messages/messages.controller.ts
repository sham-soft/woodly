import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageQueryDto } from './dto/message.dto';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    getMessages(@Query() query: MessageQueryDto) {
        return this.messagesService.getMessages(query);
    }
}