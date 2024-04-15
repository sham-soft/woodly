import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutopaymentsService } from './autopayments.service';
import { AutopaymentQueryDto } from './dto/autopayment.dto';

@ApiTags('Autopayments')
@Controller('autopayments')
export class AutopaymentsController {
    constructor(private readonly autopaymentsService: AutopaymentsService) {}

    @ApiOperation({ summary: 'Получение списка автоплатежей карты' })
    @Get()
    getAutopayments(@Query() query: AutopaymentQueryDto) {
        return this.autopaymentsService.getAutopayments(query);
    }
}