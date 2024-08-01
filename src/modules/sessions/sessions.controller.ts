import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Session } from './schemas/session.schema';
import { SessionQueryDto } from './dto/session.dto';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Получение списка всех сессий' })
    @Get()
    getAllSessions(@Query() query: SessionQueryDto): Promise<PaginatedList<Session>> {
        return this.sessionsService.getAllSessions(query);
    }
}