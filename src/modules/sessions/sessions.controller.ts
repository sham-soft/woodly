import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Delete,
    Query,
    Request,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { Session } from './schemas/session.schema';
import { SessionQueryDto } from './dto/session.dto';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Получение списка всех сессий' })
    @Get()
    getAllSessions(@Query() query: SessionQueryDto, @Request() req: CustomRequest): Promise<PaginatedList<Session>> {
        return this.sessionsService.getAllSessions(query, req.user.userId);
    }

    @ApiOperation({ summary: 'Удаление всех сессий кроме текущей' })
    @Delete('delete-all')
    deleteAllSessions(@Request() req: CustomRequest): Promise<void> {
        return this.sessionsService.deleteAllSessions(req.user.userId, req.token);
    }
}