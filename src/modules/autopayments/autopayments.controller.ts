import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { AutopaymentQueryDto } from './dto/autopayment.dto';
import { AutopaymentsService } from './autopayments.service';

@ApiTags('Autopayments')
@Controller('autopayments')
export class AutopaymentsController {
    constructor(private readonly autopaymentsService: AutopaymentsService) {}

    @ApiOperation({ summary: 'Получение списка автоплатежей карты' })
    @Get()
    getAutopayments(@Query() query: AutopaymentQueryDto): Promise<any> {
        return this.autopaymentsService.getAutopayments(query);
    }
}