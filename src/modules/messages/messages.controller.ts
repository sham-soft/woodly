import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { MessagesService } from './messages.service';
import { MessageQueryDto } from './dto/message.dto';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @ApiOperation({ summary: 'Получение списка общих смс по карте' })
    @Get()
    getMessages(@Query() query: MessageQueryDto): Promise<PaginatedList<Message>> {
        return this.messagesService.getMessages(query);
    }
}