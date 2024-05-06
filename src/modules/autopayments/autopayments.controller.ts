import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { Autopayment } from './schemas/autopayment.schema';
import { AutopaymentQueryDto } from './dto/autopayment.dto';
import { AutopaymentsService } from './autopayments.service';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Autopayments')
@Controller('autopayments')
export class AutopaymentsController {
    constructor(private readonly autopaymentsService: AutopaymentsService) {}

    @ApiOperation({ summary: 'Получение списка автоплатежей карты' })
    @Get()
    getAutopayments(@Query() query: AutopaymentQueryDto): Promise<PaginatedList<Autopayment>> {
        return this.autopaymentsService.getAutopayments(query);
    }
}