import {
    Controller,
    Get,
    Post,
    Param,
    Body,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { Payment } from './schemas/payment.schema';
import { PaymentInProcess } from './schemas/payment-in-process.schema';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get()
    getPayments(): Promise<Payment[]> {
        return this.paymentsService.getPayments();
    }

    @Get('in-process/')
    getPaymentsInProcess(): Promise<PaymentInProcess[]> {
        return this.paymentsService.getPaymentsInProcess();
    }

    @Get(':id')
    getPaymentId(@Param('id') id: string): Promise<Payment> {
        return this.paymentsService.getPaymentId(id);
    }

    @Post()
    getPaymentAvailable(@Body() paymentDto: PaymentDto): Promise<Payment | string> {
        return this.paymentsService.getPaymentAvailable(paymentDto);
    }
}