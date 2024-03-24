import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { AutopaymentsService } from './autopayments.service';
import { AutopaymentQueryDto } from './dto/autopayment.dto';

@Controller('autopayments')
export class AutopaymentsController {
    constructor(private readonly autopaymentsService: AutopaymentsService) {}

    @Get()
    getAutopayments(@Query() query: AutopaymentQueryDto) {
        return this.autopaymentsService.getAutopayments(query);
    }
}