import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from './schemas/payment.schema';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get()
    getPayments(): Promise<Payment[]> {
        return this.paymentsService.getPayments();
    }

    @Get(':id')
    getPaymentId(@Param('id') id: string): Promise<Payment> {
        return this.paymentsService.getPaymentId(id);
    }
}