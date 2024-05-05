import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageQueryDto } from './dto/message.dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @ApiOperation({ summary: 'Получение списка общих смс по карте' })
    @Get()
    getMessages(@Query() query: MessageQueryDto): Promise<any> {
        return this.messagesService.getMessages(query);
    }
}