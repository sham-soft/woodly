import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
    Ip,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
// import { Session } from './schemas/session.schema';
import { SessionQueryDto } from './dto/session.dto';
import { Public } from '../../decorators/public.decorator';
// import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Sessions')
@Public()
@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Получение списка всех сессий' })
    @Get()
    getAllSessions(@Query() query: SessionQueryDto, @Ip() ip: string): any {
        return ip;
        // return this.sessionsService.getAllSessions(query);
    }
}