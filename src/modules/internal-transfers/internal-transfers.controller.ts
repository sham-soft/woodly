import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Body,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { InternalTransfer } from './schemas/internal-transfer.schema';
import { InternalTransfersService } from './internal-transfers.service';
import { InternalTransferQueryDto } from './dto/internal-transfer.dto';
import { InternalTransferSendDto } from './dto/internal-transfer-send.dto';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Internal Transfers')
@Controller('internal-transfers')
export class InternalTransfersController {
    constructor(private readonly internalTransfersService: InternalTransfersService) {}

    @ApiOperation({ summary: 'Получение списка всех операций внутренних переводов' })
    @RequireRoles(ROLES.Admin, ROLES.Trader)
    @Get()
    getAllInternalTransfers(@Query() query: InternalTransferQueryDto): Promise<PaginatedList<InternalTransfer>> {
        return this.internalTransfersService.getAllInternalTransfers(query);
    }

    @ApiOperation({ summary: 'Перевод средств' })
    @RequireRoles(ROLES.Admin, ROLES.Trader)
    @Post('send')
    sendMoney(@Body() transferDto: InternalTransferSendDto, @Request() req: CustomRequest): Promise<InternalTransfer> {
        return this.internalTransfersService.sendMoney(transferDto, req.user.userId);
    }
}