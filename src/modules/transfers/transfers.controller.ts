import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { Transfer } from './schemas/transfer.schema';
import { TransferQueryDto } from './dto/transfer.dto';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Transfers')
@RequireRoles(ROLES.Trader)
@Controller('transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService) {}

    @ApiOperation({ summary: 'Получение списка всех операций кошелька' })
    @Get()
    getAllTransfers(@Query() query: TransferQueryDto): Promise<PaginatedList<Transfer>> {
        return this.transfersService.getAllTransfers(query);
    }
}