import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
    Request,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
// import { Session } from './schemas/session.schema';
import { SessionQueryDto } from './dto/session.dto';
import { Public } from '../../decorators/public.decorator';
// import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Sessions')
@Public()
@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @ApiOperation({ summary: 'Получение списка всех сессий' })
    @Get()
    getAllSessions(@Query() query: SessionQueryDto, @Request() req: CustomRequest): any {
        return {
            remoteAddress: req.socket.remoteAddress,
            remotePort: req.socket.remotePort,
            localAddress: req.socket.localAddress,
            localPort: req.socket.localPort,
        };
        // return this.sessionsService.getAllSessions(query);
    }
}